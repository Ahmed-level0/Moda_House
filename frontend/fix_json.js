const fs = require('fs');

function fixFile(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    // Move cities and admin from track_order to root
    if (data.track_order && data.track_order.cities) {
        data.cities = data.track_order.cities;
        delete data.track_order.cities;
    }

    if (data.track_order && data.track_order.admin) {
        data.admin = data.track_order.admin;
        delete data.track_order.admin;
    }

    // Move styles to root
    if (data.home) {
        data.styles = {
            "vintage_classic": data.home.vintage_classic || "Vintage Classic",
            "luxury_picks": data.home.luxury_picks || "Luxury Picks",
            "men_essentials": data.home.men_essentials || "Men's Essentials",
            "feminine": data.home.feminine || "Feminine Appeal",
            "elegant": data.home.elegant || "Elegant Touch",
            "casual": data.home.casual || "Casual Chic"
        };
        // Not deleting from home just in case home still uses them
    }

    // Fix product_details missing discover_fragrance in English
    if (filename.includes('en.json') && data.product_details && !data.product_details.discover_fragrance) {
        data.product_details.discover_fragrance = "Discover Fragrance";
    }

    // Fix ar.json duplicate discover_fragrance placing
    if (filename.includes('ar.json') && data.product_details && data.product_details.discover_fragrance) {
        // discover_fragrance is not used in product_details HTML, but if they want it symmetric, leave it. Let's make sure en.json has it.
    }

    fs.writeFileSync(filename, JSON.stringify(data, null, 4), 'utf8');
}

fixFile('src/assets/i18n/en.json');
fixFile('src/assets/i18n/ar.json');
console.log('Fixed JSON files.');
