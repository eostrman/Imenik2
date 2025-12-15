let trenutniMode = 'create';
let trenutniId = null;

//Na Page load
document.addEventListener('DOMContentLoaded', function() {   
    const urlParams = new URLSearchParams(window.location.search);
    trenutniMode = urlParams.get('mode') || 'create';
    trenutniId = urlParams.get('id');
    
    //ograničim max datum na današnji
    const danas = new Date().toISOString().split('T')[0];
    document.querySelector('#datumRodenja').setAttribute('max', danas);

    postaviFormu();
});

function postaviFormu() {
    const naslov = document.querySelector('#formTitle');
    const buttonGroup = document.querySelector('#buttonGroup');
    
    if (trenutniMode === 'create') {
        naslov.textContent = 'Novi kontakt';
        buttonGroup.style.display = 'flex';
        
    } else if (trenutniMode === 'edit') {
        naslov.textContent = 'Uredi kontakt';
        buttonGroup.style.display = 'flex';
        ucitajKontakt(trenutniId);
        
    } else if (trenutniMode === 'view') {
        naslov.textContent = 'Pregled kontakta';
        buttonGroup.style.display = 'none';
        ucitajKontakt(trenutniId);
        onemoguciPolja();
    }
}

function spremiKontakt () {  
    
    if (!validirajFormu()) {
        prikaziToast('Molimo ispravite greške u formi', 'error');
        return;
    }

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
        telefonBroj: getValue('telefonBroj').trim(),
        email: getValue('email').trim()
    };   

    const kontaktiString = localStorage.getItem('kontakti');
    let kontakti = kontaktiString ? JSON.parse(kontaktiString) : [];


    //iteriraj kroz kontake dok ne nađeš kontakt koji ima id jednak trenutačnom tj. onom koji editiraš
    if (trenutniMode === 'edit') {
        for (let i = 0; i < kontakti.length; i++) {
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

function ucitajKontakt (id) {
    const kontaktiString = localStorage.getItem('kontakti');

    //ništa nema kontakata, returnaj
    if (kontaktiString === '') {
        return;
    }

    let kontakti = kontaktiString ? JSON.parse(kontaktiString) : [];
    let kontakt = null;

    for (let i = 0; i <kontakti.length; i++) {
        if (kontakti[i].kontakt === id) {
            kontakt = kontakt[i];
            break;
        }
    }

    if (kontakt !== '') {
        document.getElementById('ime').value = kontakt.ime;
        document.getElementById('prezime').value = kontakt.prezime;
        document.getElementById('datumRodenja').value = kontakt.datumRodenja;
        document.getElementById('datumRodenja').value = kontakt.adresa;
        document.getElementById('datumRodenja').value = kontakt.adresa;
        document.getElementById('datumRodenja').value = kontakt.adresa;
        document.getElementById('email').value = kontakt.email;
    }
}

function validirajFormu (id) {
    let isValid = true;

    const greske = document.querySelectorAll('.error-message');
    for (let i = 0; i < greske.length; i++) {
        greske[i].style.display = 'none';
    }
    
    const inputs = document.querySelectorAll('input, select');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('input-error');
    }

    const ime = document.getElementById('ime').value.trim();
    if (ime === '') {
        document.getElementById('imeError').style.display = 'block';
        document.getElementById('ime').classList.add('input-error');
        isValid = false;
    }

    const prezime = document.getElementById('prezime').value.trim();
    if (prezime === '') {
        document.getElementById('prezimeError').style.display = 'block';
        document.getElementById('prezime').classList.add('input-error');
        isValid = false;
    }

    const datumRodenja = document.getElementById('datumRodenja').value;
    const danas = new Date();
    danas.setHours(1,0,0,0);
    const odabraniDatum = new Date(datumRodenja);
    if (datumRodenja === '' || odabraniDatum > danas) {
        document.getElementById('datumError').style.display = 'block';
        document.getElementById('datumRodenja').classList.add('input-error');
        isValid = false;
    }

    const adresa = document.getElementById('adresa').value.trim();
    if (adresa === '') {
        document.getElementById('adresaError').style.display = 'block';
        document.getElementById('adresa').classList.add('input-error');
        isValid = false;
    }

    const postanskiBroj = document.getElementById('postanskiBroj').value.trim();
    const postanskiBrojRegex = /^[0-9]{1,5}$/;
    if (postanskiBrojRegex.test(postanskiBroj) === false) {
        document.getElementById('postanskiError').style.display = 'block';
        document.getElementById('postanskiBroj').classList.add('input-error');
        isValid = false;
    }

    const telefonBroj = document.getElementById('telefonBroj').value.trim();
    const telefonBrojRegex = /^[0-9]{1,7}$/;
    if (telefonBrojRegex.test(telefonBroj) === false) {
        document.getElementById('telefonError').style.display = 'block';
        document.getElementById('telefonBroj').classList.add('input-error');
        isValid = false;
    }

    const email = document.getElementById('email').value.trim();
    if (email === '') {
        document.getElementById('emailError').style.display = 'block';
        document.getElementById('email').classList.add('input-error');
        isValid = false;
    }

    return isValid;
}

function onemoguciPolja () {
    document.getElementById('ime').disabled = true;
    document.getElementById('prezime').disabled = true;
    document.getElementById('datumRodenja').disabled = true;
    document.getElementById('adresa').disabled = true;
    document.getElementById('postanskiBroj').disabled = true;
    document.getElementById('telefonBroj').disabled = true;
}

//ovo je ispravan način generiranja UUID-a
const generirajId = () => crypto.randomUUID();

function odustani() {
    setTimeout(function() {
        window.location.href = 'list.html';        
    }, 500);
}

function formatirajDatum(datum) {
    if (!datum) 
        {
            return '';
        } 
    
    const dijelovi = datum.split('-');
        
    return dijelovi[2] + '.' + dijelovi[1] + '.' + dijelovi[0] + '.';
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