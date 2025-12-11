async function uploadVideo() {
    const video = document.getElementById("videoInput").files[0];

    if (!video) {
        alert("Pilih video dulu!");
        return;
    }

    document.getElementById("result").innerHTML = "Processing video... ⏳";

    const formData = new FormData();
    formData.append("video", video);

    // Ganti URL ini setelah deploy backend di Railway
    const backendURL = "http://localhost:3000";

    const upload = await fetch(backendURL + "/upload", {
        method: "POST",
        body: formData
    });

    const response = await upload.json();

    if (response.error) {
        document.getElementById("result").innerHTML = "Error: " + response.error;
        return;
    }

    // Tampilkan link untuk download hasil
    const fileName = response.output.split("/").pop();

    document.getElementById("result").innerHTML = `
        <p>Video selesai diproses! 🎉</p>
        <a href="${backendURL}/file/${fileName}" download>Download Short Video</a>
    `;
}