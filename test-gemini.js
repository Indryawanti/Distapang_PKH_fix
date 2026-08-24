const apiKey = "AQ.Ab8RN6IaiVRvh5J-Dp-j51nKsdC34-fIVFxqE9n5UQqb7h1sfg";

async function test() {
  console.log("Mengirim request ke Gemini...");
  const start = Date.now();

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "halo, jawab singkat" }] }],
        }),
      }
    );

    const data = await res.json();
    console.log(`Selesai dalam ${Date.now() - start}ms`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(`Error setelah ${Date.now() - start}ms:`, err.message);
  }
}

test();