// Инициализация (используйте те же данные, что в script.js)
const sb = supabase.createClient(
    'https://gbpntxkkxabndhtpdaai.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicG50eGtreGFibmRodHBkYWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDYwOTMsImV4cCI6MjA4Njk4MjA5M30.8a1idD6mrHX2vAvVf98sMx8JPrWmwVwkBxoANytZ4p0' // Вставьте ваш реальный ключ
);
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("archive-container");
    
    // Исправила опечатку: было condtainer, стало container
    if (!container) {
        console.warn("Контейнер #archive-container не найден.");
        return;
    }

    // Загружаем письма, пропуская первые 5 (они на главной)
    // Используем .range(5, 1000), чтобы показать письма с 6-го по 1000-е
    // В archive-script.js должно быть так:
const { data, error } = await sb
    .from('letters')
    .select('id, title, text, created_at')
    .order('created_at', { ascending: false, nullsLast: true })
    .range(4, 1000); // ПРОПУСКАЕМ первые 4 письма (0, 1, 2, 3), берем всё остальное

    if (error) {
        console.error("Ошибка Supabase:", error);
        container.innerHTML = `<p style="color:red;">Ошибка загрузки архива: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Il n'y a pas de vieilles lettres dans les archives.</p>";
    } else {
        container.innerHTML = "";
        data.forEach(item => {
            // Форматируем дату для красоты
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('ru-RU') : "";
            
            const article = document.createElement("article");
            article.className = "letter";
            article.innerHTML = `
                <h2 style="margin: 0; padding: 0; line-height: 1.2;">${item.title}</h2>
                <span style="font-size: 10px; color: #888; display: block; margin: 5px 0;">${dateStr}</span>
                <p style="margin: 4px 0 0 0; padding: 0; line-height: 1.4;">${item.text}</p>
            `;
            container.appendChild(article);
        });
    }
});document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("archive-container");
    
    if (!container) return;

    // Загружаем письма (пропуская первые 4, которые на главной)
    const { data, error } = await sb
        .from('letters')
        .select('id, title, text, created_at')
        .order('created_at', { ascending: false })
        .range(4, 1000); 

    if (error) {
        container.innerHTML = `<p>Ошибка загрузки архива: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Il n'y a pas de vieilles lettres dans les archives.</p>";
    } else {
        container.innerHTML = "";
        data.forEach(item => {
            const article = document.createElement("article");
            // ВАЖНО: используем класс .letter-card для нашего дизайна
            article.className = "letter-card"; 
            
            article.innerHTML = `
                <h3>${item.title || 'Sans titre'}</h3>
                <p>${item.text}</p>
                <small>${new Date(item.created_at).toLocaleDateString('fr-FR')}</small>
            `;
            
            // Добавляем логику открытия модалки
            article.onclick = () => {
                document.getElementById("modal-title").innerText = item.title;
                document.getElementById("modal-text").innerText = item.text;
                document.getElementById("read-modal").style.display = "block";
            };
            
            container.appendChild(article);
        });
    }
});