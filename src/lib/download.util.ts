/** Save text as a CSV file in the browser (client components only). */
export const downloadCsv = (csv: string, fileName: string) => {
  const url = URL.createObjectURL(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before revoking
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
