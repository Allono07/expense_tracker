

export const readSheet = async (spreadsheetId: string, accessToken: string) => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:C`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data.values;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

export const writeSheet = async (spreadsheetId: string, values: any[][], accessToken: string) => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:C:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values,
      }),
    });
    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error(err);
    return null;
  }
};
