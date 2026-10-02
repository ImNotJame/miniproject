const list = document.getElementById("movie-list");
const stats = document.getElementById("stats");
const search = document.getElementById("search");
const form = document.getElementById("movie-form");
const errorBox = document.getElementById("error");
const submitBtn = form.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById("cancel-edit");

let movies = [];
let editingId = null;

async function loadMovies() {
    try{
        const res = await fetch("/api/movies");
        if(!res.ok){
            throw new Error("ไม่สามารถโหลดข้อมูลได้");
        }
        movies = await res.json();
        render();
    }catch(err){
        console.error(err);
        stats.textContent = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    }    
}


async function deleteMovie(id) {
    if(!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบหนังนี้")){
        return;
    }

    try{
        const res = await fetch(`/api/movies/${id}`, {
            method: "DELETE"
        });

        if (!res.ok){
            alert("เกิดข้อผิดพลาดในการลบหนัง");
            return;
        }


        movies = movies.filter((m) => m.id !== id);
        if(editingId === id){
            stopEdit();
        }
        render();
    } catch(err){
        console.error(err);
        alert("เกิดข้อผิดพลาดในการลบหนัง");
    }
}

function startEdit(m){
    editingId = m.id;
    form.title.value = m.title;
    form.year.value = m.year || "";
    form.watchedOn.value = m.watchedOn || "";
    form.rating.value = m.rating;
    form.notes.value = m.notes || "";
    submitBtn.textContent = "บันทึกการแก้ไข";
    cancelBtn.hidden = false;
    form.scrollIntoView({behavior: "smooth"});
    form.title.focus();
}

function stopEdit(){
    editingId = null;
    form.reset();
    submitBtn.textContent = "เพิ่มหนัง";
    form.watchedOn.value = today();
    cancelBtn.hidden = true;
    errorBox.textContent = "";
}

cancelBtn.addEventListener("click", stopEdit);

function render(){
    const query = search.value.trim().toLowerCase();
    const visible = movies.filter((m) => (m.title + " " + m.notes).toLowerCase().includes(query));
    if(movies.length === 0){
        stats.textContent = "ไม่พบข้อมูล";
    }else{
        const total = movies.reduce((sum,m)=> sum + m.rating, 0);
        const average = total / movies.length;
        stats.textContent = `จํานวนหนังที่ดู: ${movies.length} คะแนนเฉลี่ย: ${average.toFixed(1)}`;
    }


    list.replaceChildren();



    if(visible.length === 0){
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = movies.length === 0 ? "เพิ่มหนังได้เลย" : "ไม่พบข้อมูล";
        list.append(empty);
        return;
    }

    for( const m of visible){
        const li = document.createElement("li");
        li.className = "movie";


        const title = document.createElement("h2");
        title.textContent = m.title;
        

        const stars = document.createElement("div");
        stars.className = "stars";
        stars.textContent = "★".repeat(m.rating) + "☆".repeat(5 - m.rating); 


        const meta  = document.createElement("div");
        meta.className = "meta";
        const part = [];
        if (m.year) part.push(`ปี ${m.year}`);
        if (m.watchedOn) part.push(`ดูเมื่อ ${m.watchedOn}`);
        meta.textContent = part.join(", ");

        li.append(title, stars, meta);
        

        if(m.notes){
            const note = document.createElement("p");
            note.textContent = m.notes;
            li.append(note);
        }

        const actions = document.createElement("div");
        actions.className = "actions";

        const edit = document.createElement("button");
        edit.className = "edit";
        edit.textContent = "แก้ไข";
        edit.addEventListener("click", () => startEdit(m));

        const del = document.createElement("button");
        del.className = "delete";
        del.textContent = "ลบ";
        del.addEventListener("click", () => deleteMovie(m.id));
        
        actions.append(edit,del);
        li.append(actions);

        list.append(li);
    }
}


search.addEventListener("input",render);
loadMovies();




form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";

    const newMovie = {
        title: form.title.value,
        year: form.year.value ? Number(form.year.value) : null,
        watchedOn: form.watchedOn.value,
        rating: Number(form.rating.value),
        notes: form.notes.value

    };

    const url = editingId ? `/api/movies/${editingId}` : "/api/movies";
    const method = editingId ? "PATCH" : "POST";

    try{
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMovie)
        });

        if(!res.ok){
            errorBox.textContent = "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
            return;
        }


        const saved = await res.json();

        if(editingId){
            movies = movies.map((m) => m.id === editingId ? saved : m);
        }else{
            movies.unshift(saved);
        }
        
        stopEdit();
        render();
    }catch(err){
        console.error(err);
        errorBox.textContent = "เชื่อมต่อไม่ได้";
    }

});

form.watchedOn.valueAsDate = new Date();