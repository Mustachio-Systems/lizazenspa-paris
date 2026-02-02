// js/content.js
const spaData = {
    contact: {
        phone: "06 03 69 36 49",
        address: "10, rue Auguste Chabrières, 75015 Paris",
        // UPDATED NOTE BELOW:
        streetViewNote: "⚠️ Info Street View : Google affiche encore l'ancien commerce 'Pizza Eva'. Ne vous inquiétez pas, le Liza Zen Spa est bien ouvert à cette adresse précise !", 
        whatsapp: "https://wa.me/33603693649"
    },
    // Text for the Homepage Cards
    homeCards: {
        thai: {
            title: "Massage Thaï",
            desc: "L'alliance parfaite entre acupression, étirements et travail énergétique. Ce soin signature libère les tensions profondes, améliore la souplesse et rééquilibre le flux d'énergie vital (Sen) de votre corps."
        },
        stone: {
            title: "Pierres Chaudes",
            desc: "Une expérience sensorielle unique. La chaleur douce des pierres volcaniques glisse sur votre peau pour faire fondre le stress instantanément. Idéal pour une relaxation musculaire profonde."
        },
        ventouse: {
            title: "Thérapie Ventouse",
            desc: "Une méthode ancestrale de détoxification. En stimulant la circulation sanguine par aspiration, ce soin cible efficacement les douleurs dorsales chroniques et les cervicales bloquées."
        }
    },
    prices: {
        thaiOil: [
            { time: "30 minutes", price: "70€" },
            { time: "1 heure", price: "100€" },
            { time: "1h30", price: "150€" },
            { time: "2 heures (avec soin visage)", price: "195€" }
        ],
        ventouse: [
            { time: "1h00", price: "150€" },
            { time: "1h30", price: "190€" },
            { time: "2h00", price: "250€" }
        ],
        hotStone: [
            { time: "1h10", price: "150€" }
        ]
    }
};

// --- ADD THIS FUNCTION AT THE BOTTOM OF CONTENT.JS ---
// This function will automatically fill the HTML when the page loads
function loadDynamicContent() {
    // 1. Update Homepage Service Cards (if they exist on the page)
    if(document.getElementById('home-thai-desc')) {
        document.getElementById('home-thai-title').innerText = spaData.homeCards.thai.title;
        document.getElementById('home-thai-desc').innerText = spaData.homeCards.thai.desc;
    }
    if(document.getElementById('home-stone-desc')) {
        document.getElementById('home-stone-title').innerText = spaData.homeCards.stone.title;
        document.getElementById('home-stone-desc').innerText = spaData.homeCards.stone.desc;
    }
    if(document.getElementById('home-ventouse-desc')) {
        document.getElementById('home-ventouse-title').innerText = spaData.homeCards.ventouse.title;
        document.getElementById('home-ventouse-desc').innerText = spaData.homeCards.ventouse.desc;
    }

    // 2. Update Contact Info (Address & Links)
    const addressEls = document.querySelectorAll('.dynamic-address');
    addressEls.forEach(el => el.innerText = spaData.contact.address);

    const noteEl = document.getElementById('dynamic-street-note');
    if(noteEl) {
        noteEl.innerText = spaData.contact.streetViewNote;
        // Optional: Make the note text red or orange to catch attention
        noteEl.style.color = "#d9534f"; 
        noteEl.style.fontWeight = "500";
    }

    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => link.href = spaData.contact.whatsapp);
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', loadDynamicContent);