export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw&include_last_updated_at=true',
      { next: { revalidate: 300 } }
    );
    const data = await response.json();

    return Response.json({
      price: data.bitcoin.krw,
      lastUpdated: new Date().toISOString(),
    });
  } catch {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
