// Na Page load-u
document.addEventListener('DOMContentLoaded', function() {
    prikaziKontakte();
});

function prikaziKontakte() {
    const tableBody = document.getElementById('tableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const table = document.getElementById('contactsTable');
    const template = document.getElementById('contactRowTemplate');
    
    const kontaktiString = localStorage.getItem('kontakti');
    const kontakti = kontaktiString ? JSON.parse(kontaktiString) : [];
    
    tableBody.innerHTML = '';
    
    if (kontakti.length === 0) {
        table.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    // iteriraj pa dodaj u tablicu
    for (let i = 0; i < kontakti.length; i++) {
        const kontakt = kontakti[i];
        let row = document.createElement('tr');
        
        const datumFormatiran = formatirajDatum(kontakt.datumRodenja);        
        
        const telefon = kontakt.telefonPrefiks + ' ' + kontakt.telefonBroj;
        
        row = template.content.cloneNode(true);

        row.querySelector('.ime').textContent = kontakt.ime;
        row.querySelector('.prezime').textContent = kontakt.prezime;
        row.querySelector('.datum').textContent = datumFormatiran;
        row.querySelector('.telefon').textContent = telefon;
        row.querySelector('.email').textContent = kontakt.email;

        row.querySelector('.btn-view').onclick = () => pregledajKontakt(kontakt.id);
        row.querySelector('.btn-edit').onclick = () => urediKontakt(kontakt.id);
        row.querySelector('.btn-delete').onclick = () => obrisiKontakt(kontakt.id);
        
        tableBody.appendChild(row);
    }
}

// Format datuma iz YYYY-MM-DD u DD.MM.YYYY - nažalost formatiranje mora ić jer datepicker prikazuje u HR culture ali u backgroundu radi u ISO modu tj. YYYY-MM-DD
//mislio sam ga prevarit pa prije spremanja kontakta napravit format u naš ali onda na editu opet moram pretvarat u ISO tak da si dupliciram posao
//vidjet ću kad dođem do validacije hoće li bit dorada
function formatirajDatum(datum) {
    if (!datum) 
        {
            return '';
        } 
    
    const dijelovi = datum.split('-');
        
    return dijelovi[2] + '.' + dijelovi[1] + '.' + dijelovi[0] + '.';
}

// Funkcija za pregled kontakta
    // TODO

// Funkcija za uređivanje kontakta
    // TODO

// Funkcija za brisanje kontakta (otvara modal)
    // TODO

// Funkcija za zatvaranje modala
    // TODO

// Funkcija za potvrdu brisanja
    // TODO

// Funkcija za prikaz toast obavijesti
    // TODO

