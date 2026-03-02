import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { robotoBase64 } from "../assets/font-base64";

export function generateKartaPDF(data) {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Add Polish font
    const filename = "Roboto-Regular.ttf";
    doc.addFileToVFS(filename, robotoBase64);
    doc.addFont(filename, "Roboto", "normal");
    doc.setFont("Roboto");


    // Header with Color Bar
    doc.setFillColor(41, 128, 185); // Professional Blue
    doc.rect(0, 0, 297, 25, 'F');

    // Extract Month/Year from first row if possible
    let dateHeader = "";
    if (data.rows && data.rows[0] && data.rows[0].date) {
        const dateParts = data.rows[0].date.split('.');
        if (dateParts.length >= 2) {
            const month = dateParts[1];
            const year = dateParts[2] || new Date().getFullYear();
            const monthNames = ["", "STYCZEŃ", "LUTY", "MARZEC", "KWIECIEŃ", "MAJ", "CZERWIEC", "LIPIEC", "SIERPIEŃ", "WRZESIEŃ", "PAŹDZIERNIK", "LISTOPAD", "GRUDZIEŃ"];
            const monthIndex = parseInt(month);
            if (monthIndex >= 1 && monthIndex <= 12) {
                dateHeader = ` - ${monthNames[monthIndex]} ${year}`;
            }
        }
    }

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(`KARTA DROGOWA${dateHeader}`, 14, 17);

    // Header Info Box
    doc.setFontSize(9);
    doc.setTextColor(210, 230, 255); // Subtle light blue for labels
    doc.text(`Kierowca 1:`, 170, 12);
    doc.text(`Kierowca 2:`, 170, 18);
    doc.text(`Nr Rejestracyjny:`, 235, 12);
    doc.text(`Nr Naczepy:`, 235, 18);

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255); // Pure white for values
    doc.text(`${data.driverName || '-'}`, 190, 12);
    doc.text(`${data.driver2Name || '-'}`, 190, 18);
    doc.text(`${data.registrationNumber || '-'}`, 265, 12);
    doc.text(`${data.trailerNumber || '-'}`, 265, 18);

    // Reset Text Color for the rest of doc
    doc.setTextColor(44, 62, 80);

    // Table
    const tableColumn = [
        "Lp", "Data", "Przyjazd", "Odjazd", "Kod", "Miejscowość", "Firma",
        "Zał", "Roz", "Wym", "Gra", "Pos", "Uwagi", "Tony", "DKV", "IDS", "Lotos", "AdBlue", "Licznik"
    ];

    const tableRows = data.rows.map((row, index) => [
        index + 1,
        row.date,
        row.arrivalTime,
        row.departureTime,
        row.postcode,
        row.city,
        row.company,
        row.loading ? "X" : "",
        row.unloading ? "X" : "",
        row.exchange ? "X" : "",
        row.border ? "X" : "",
        row.stoppage ? "X" : "",
        row.notes,
        row.tons,
        row.fuelDkv,
        row.fuelIds,
        row.fuelLotos,
        row.fuelAdBlue,
        row.odometer
    ]);

    autoTable(doc, {
        startY: 32,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: {
            font: 'Roboto',
            fontSize: 7,
            cellPadding: 1.5,
            halign: 'center',
            lineColor: [200, 200, 200]
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontStyle: 'normal'
        },
        alternateRowStyles: {
            fillColor: [245, 248, 255]
        },
    });


    // Summary Calculations
    const startOdo = parseFloat(data.rows[0]?.odometer) || 0;
    const endOdo = parseFloat(data.rows[data.rows.length - 1]?.odometer) || 0;
    const totalKm = endOdo > startOdo ? endOdo - startOdo : 0;

    const totalFuel = data.rows.reduce((sum, row) => {
        return sum + (parseFloat(row.fuelDkv) || 0) + (parseFloat(row.fuelIds) || 0) + (parseFloat(row.fuelLotos) || 0);
    }, 0);

    const avgFuel = totalKm > 0 ? ((totalFuel / totalKm) * 100).toFixed(2) : '0.00';

    let finalY = doc.lastAutoTable.finalY + 12;

    // Check if we have space on page
    if (finalY > 175) {
        doc.addPage();
        finalY = 25;
    }

    // Calculations Box with Background
    doc.setFillColor(240, 245, 250);
    doc.roundedRect(14, finalY - 5, 95, 40, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(41, 128, 185);
    doc.text(`PODSUMOWANIE TRASY`, 18, finalY + 2);

    doc.setTextColor(44, 62, 80);
    doc.setFontSize(10);
    doc.text(`Suma kilometrów:`, 18, finalY + 10);
    doc.text(`${totalKm} km`, 75, finalY + 10, { align: 'right' });

    doc.text(`Suma paliwa:`, 18, finalY + 17);
    doc.text(`${totalFuel.toFixed(2)} L`, 75, finalY + 17, { align: 'right' });

    doc.text(`Średnie spalanie:`, 18, finalY + 24);
    doc.setTextColor(192, 57, 43); // Subtle Red for efficiency
    doc.text(`${avgFuel} L/100km`, 75, finalY + 24, { align: 'right' });

    doc.setTextColor(44, 62, 80);
    doc.text(`Stan licznika:`, 18, finalY + 31);
    doc.text(`${startOdo} -> ${endOdo}`, 90, finalY + 31, { align: 'right' });

    // General Notes Box
    doc.setFillColor(252, 252, 252);
    doc.rect(120, finalY - 5, 163, 40, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.rect(120, finalY - 5, 163, 40, 'S');

    doc.setTextColor(41, 128, 185);
    doc.text(`UWAGI OGÓLNE`, 125, finalY + 2);
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(data.generalNotes || '-', 150);
    doc.text(splitNotes, 125, finalY + 10);

    // Signatures
    finalY += 50;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, finalY, 84, finalY);
    doc.text("Podpis pierwszego kierowcy", 14, finalY + 5);

    doc.line(104, finalY, 174, finalY);
    doc.text("Podpis drugiego kierowcy", 104, finalY + 5);

    doc.line(194, finalY, 280, finalY);
    doc.text("Pieczątka firmy / uwagi dyspozytora", 194, finalY + 5);

    doc.save(`Karta_Drogowa_${data.registrationNumber || 'NoNR'}.pdf`);
}


