export const downloadConstituents = async (
  authenticationToken: string | null
) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  fetch(`${BASE_URL}/csv/download`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authenticationToken}`,
    },
  })
    .then((response) => response.blob()) // Handle the response as a Blob
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "constituents.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
};

export const getConstituents = async (authenticationToken: string | null) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  console.log({ BASE_URL });
  try {
    const response = await fetch(`${BASE_URL}/constituent`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authenticationToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching constituents:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
