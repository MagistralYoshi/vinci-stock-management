// Fonction pour exporter en CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        const escaped = String(value || '').replace(/"/g, '""')
        return `"${escaped}"`
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Fonction pour exporter en JSON
export const exportToJSON = (data, filename = 'export.json') => {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter')
    return
  }

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Fonction pour générer un PDF simple (texte)
export const exportToPDF = (title, data, filename = 'export.pdf') => {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter')
    return
  }

  let content = `${title}\n\n`
  content += `Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}\n`
  content += '='.repeat(80) + '\n\n'

  if (Array.isArray(data)) {
    data.forEach((row, idx) => {
      content += `\n--- Entrée ${idx + 1} ---\n`
      Object.entries(row).forEach(([key, value]) => {
        content += `${key}: ${value}\n`
      })
    })
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Fonction pour imprimer les données
export const printData = (title, html) => {
  const printWindow = window.open('', '', 'height=400,width=600')
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #0f172a; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .date { color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="date">Imprimé le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        ${html}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}
