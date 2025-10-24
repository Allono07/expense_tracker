

export const readSheet = async (spreadsheetId: string, accessToken: string) => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:C`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Check for 401 Unauthorized (token expired)
    if (response.status === 401) {
      console.error('Access token expired (401)');
      return { error: 'token_expired' };
    }
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
    // Check for 401 Unauthorized (token expired)
    if (response.status === 401) {
      console.error('Access token expired (401)');
      return { error: 'token_expired' };
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error(err);
    return null;
  }
};
