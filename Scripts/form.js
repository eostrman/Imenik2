let trenutniMode = 'create';
let trenutniId = null;

document.addEventListener('DOMContentLoaded', function() {   
    // Dohvati parametre iz URL-a
    const urlParams = new URLSearchParams(window.location.search);
    trenutniMode = urlParams.get('mode') || 'create';
    trenutniId = urlParams.get('id');
    
    postaviFormu();
});

function postaviFormu() {
    const naslov = document.querySelector('#formTitle');
    const buttonGroup = document.querySelector('#buttonGroup');
    
    if (trenutniMode === 'create') {
        //Kreiraj novi kontakt
        naslov.textContent = 'Novi kontakt';
        buttonGroup.style.display = 'flex';
        
    } else if (trenutniMode === 'edit') {
        //Uredi kontakt
        naslov.textContent = 'Uredi kontakt';
        buttonGroup.style.display = 'flex';
        ucitajKontakt(trenutniId);
        
    } else if (trenutniMode === 'view') {
        // Pregledaj kontakt
        naslov.textContent = 'Pregled kontakta';
        buttonGroup.style.display = 'none';
        ucitajKontakt(trenutniId);
        onemogociPolja();
    }
}

function spremiKontakt () {    

    const getValue = (id) => document.querySelector(`#${id}`).value;
   
    const kontakt = 
    {
        id: trenutniMode === 'edit' ? trenutniId : generirajId(),
        ime: getValue('ime').trim(),
        prezime: getValue('prezime').trim(),
        datumRodenja: getValue('datumRodenja'),
        adresa: getValue('adresa').trim(),
        postanskiBroj: getValue('postanskiBroj').trim(),
        telefonPrefiks: getValue('telefonPrefiks'),
        telefonBroj: getValue('telefonBroj').trim()
    };   

    const kontaktiString = localStorage.getItem('kontakti');
    let kontakti = kontaktiString ? JSON.parse(kontaktiString) : [];


    //iteriraj kroz kontake dok ne nađeš kontakt koji ima id jednak trenutačnom tj. onom koji editiraš
    if (trenutniMode === 'edit') {
        for (var i = 0; i < kontakti.length; i++) {
            if (kontakti[i].id === trenutniId) {
                kontakti[i] = kontakt;
                break;
            }
        }                
    }
    else {
        kontakti.push(kontakt);
        prikaziToast('Kontakt uspješno spremljen!', 'success');
    }   

    localStorage.setItem('kontakti', JSON.stringify(kontakti));

    setTimeout(function() {
        window.location.href = 'list.html';        
    }, 500);
}

//ovo je ispravan način generiranja UUID-a
const generirajId = () => crypto.randomUUID();

function odustani() {

    setTimeout(function() {
        window.location.href = 'list.html';        
    }, 500);
}

function prikaziToast(poruka, tip) {
    var toast = document.getElementById('toast');
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