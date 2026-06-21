
const sb = supabase.createClient(
    'https://gbpntxkkxabndhtpdaai.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicG50eGtreGFibmRodHBkYWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDYwOTMsImV4cCI6MjA4Njk4MjA5M30.8a1idD6mrHX2vAvVf98sMx8JPrWmwVwkBxoANytZ4p0'
);



async function loadLetters() {
    const container = document.querySelector(".letters");
    if (!container) return;

    const { data, error } = await sb
        .from('letters')
        .select('id, title, text, created_at')
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) return;

    container.innerHTML = "";
    data.forEach(item => {
        const article = document.createElement("article");
        article.className = "letter-card";
        
        const words = (item.text || "").split(' ');
        const shortText = words.length > 20 ? words.slice(0, 20).join(' ') + "..." : item.text;

        article.innerHTML = `
            <h3>${item.title || 'Sans titre'}</h3>
            <p>${shortText}</p>
            <small>Lire la suite...</small>
        `;
        
        article.onclick = () => {
            document.getElementById("modal-title").innerText = item.title;
            document.getElementById("modal-text").innerText = item.text;
            document.getElementById("read-modal").style.display = "block";
        };
        container.appendChild(article);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadLetters();

    const writeButton = document.querySelector(".write-button");
    const writeModal = document.querySelector(".write-modal");
    const closeWrite = document.querySelector(".closeWrite");
    const sendBtn = document.getElementById("send-btn");

    writeButton.addEventListener("click", () => writeModal.style.display = "block");
    closeWrite.addEventListener("click", () => writeModal.style.display = "none");

    sendBtn.addEventListener("click", async () => {
        const title = document.getElementById("letter-title").value;
        const text = document.getElementById("letter-content").value;

        // Если текст пуст, просто выходим из функции без сообщения
        if (!text.trim()) {
            return;
        }

        const { error } = await sb.from('letters').insert([{ 
            title: title || "Sans titre", 
            text: text,
            created_at: new Date().toISOString()
        }]);

        // Если возникла ошибка, мы просто не делаем ничего (или можно добавить console.error)
        if (!error) {
            document.getElementById("letter-title").value = "";
            document.getElementById("letter-content").value = "";
            writeModal.style.display = "none";
            loadLetters();
        }
    });});