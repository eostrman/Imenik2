kontaktZaBrisanje = null;

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
    
    table.style.display = 'table';
    emptyMessage.style.display = 'none';
    
    // iteriraj pa dodaj u tablicu
    for (let i = 0; i < kontakti.length; i++) {
        const kontakt = kontakti[i];
        let row = document.createElement('tr');
        
        const datumFormatiran = formatirajDatum(kontakt.datumRodenja);        
        
        const telefon = kontakt.telefonPrefiks + kontakt.telefonBroj;
        const formatiraniTelefonBroj = formatTelefonBroj(telefon);
        
        row = template.content.cloneNode(true);

        row.querySelector('.ime').textContent = kontakt.ime;
        row.querySelector('.prezime').textContent = kontakt.prezime;
        row.querySelector('.datum').textContent = datumFormatiran;
        row.querySelector('.telefon').textContent = formatiraniTelefonBroj;
        row.querySelector('.email').textContent = kontakt.email;
        
        row.querySelector('.btn-view').onclick = () => pregledajKontakt(kontakt.id);
        row.querySelector('.btn-edit').onclick = () => urediKontakt(kontakt.id);
        row.querySelector('.btn-delete').onclick = () => obrisiKontakt(kontakt.id);

        tableBody.appendChild(row);
    }
}

function formatTelefonBroj (broj) {
    const brojFormatiran = broj.substring(0,3) + "\\" + broj.substring(3,6) + '-' + broj.substring(6);
    return brojFormatiran;
}

function formatirajDatum(datum) {
    if (!datum) 
        {
            return '';
        } 
    
    const dijelovi = datum.split('-');
        
    return dijelovi[2] + '.' + dijelovi[1] + '.' + dijelovi[0] + '.';
}

function pregledajKontakt (id) {
    window.location.href = 'form.html?mode=view&id=' + id;
}

function urediKontakt (id) {
    window.location.href = 'form.html?mode=edit&id=' + id;
}

function obrisiKontakt (id) {
    kontaktZaBrisanje = id;
    ///mogu dohvatiti po ID selectoru
    document.querySelector('#deleteModal').style.display = 'flex';
}

function zatvoriModal () {
    kontaktZaBrisanje = null;
    //ili mogu dohvatiti po class selectoru
    document.querySelector('.modal-overlay').style.display = 'none';
}

function potvrdiObrisi() {
    if (!kontaktZaBrisanje) {
        return;
    }

    const kontaktiString = localStorage.getItem('kontakti');
    const kontakti = kontaktiString ? JSON.parse(kontaktiString) : [];

    const noviKontakt = [];
    for (let i = 0; i < kontakti.length; i++) {
        if (kontakti[i].id !== kontaktZaBrisanje) {
            //push je ko u C# .Add kad dodajemo u niz/listu. Javascript nema array i list nego je array ko list u C#
            noviKontakt.push(kontakti[i]);
        }
    }

    //sad si update-aj kontakte
    localStorage.setItem('kontakti', JSON.stringify(noviKontakt));

    zatvoriModal();

    prikaziToast('Kontakt je obrisan', 'success');

    //refrešhaj listu
    prikaziKontakte();
}

function prikaziToast(poruka, tip) {
    const toast = document.getElementById('toast');
    toast.textContent = poruka;
    toast.className = 'toast';
    
    if (tip === 'success') {
        toast.classList.add('toast-success');
    } else {
        toast.classList.add('toast-error');
    }
    
    toast.style.display = 'block';
    
    // Sakrij toast nakon 3 sekunde
    setTimeout(function() {
        toast.style.display = 'none';
    }, 3000);
}

