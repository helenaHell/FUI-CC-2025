console.log("DIST-ADDRESSES loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// DATA CONSTANTS
// =====================

const STREET_NAMES = [
  "Ferret House", "Billlies Street", "Kilrous Street", "Henri Way",
  "Evercup Eau Street", "Bailey Street", "Oxford Road", "Park Lane",
  "Victoria Street", "Cambridge Avenue", "Wellington Road", "Churchill Way",
  "Elizabeth Court", "Richmond Terrace", "Kensington Gardens", "Abbey Road",
  "Regent Street", "Piccadilly Circus", "Leicester Square", "Trafalgar Way",
  "Westminster Bridge", "Tower Hill", "London Bridge", "Fleet Street",
  "Strand", "Holborn Viaduct", "King's Cross", "Euston Road"
];

const CITY_NAMES = [
  "Manchester", "Middleham", "Branley", "Zarton", "Mortimer",
  "Everton", "Bristol", "Leeds", "Liverpool", "Birmingham"
];

const COUNTRY_CODES = ["GBR", "UK", "ENG", "FRA", "DEU"];
const POSTAL_CODES = ["SW1A 1AA", "EC1A 1BB", "W1A 0AX", "M1 1AE"];
const AREA_NAMES = ["Westminster", "Camden", "Islington", "Hackney"];

// =====================
// STATE
// =====================

const addressState = {
  initialized: false,
  addresses: [],
  counter: 1,
  maxAddresses: 50
};

// =====================
// FACTORY
// =====================

function createAddress() {
  const id = String(addressState.counter++).padStart(3, "0");

  return {
    id,
    number: Math.floor(Math.random() * 9000) + 100,
    street: STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)],
    city: CITY_NAMES[Math.floor(Math.random() * CITY_NAMES.length)],
    country: COUNTRY_CODES[Math.floor(Math.random() * COUNTRY_CODES.length)],
    area: AREA_NAMES[Math.floor(Math.random() * AREA_NAMES.length)],
    postal: POSTAL_CODES[Math.floor(Math.random() * POSTAL_CODES.length)]
  };
}

// =====================
// RENDER
// =====================

function renderHeader() {
  return `
    <div class="addr-header">
      <span>ID</span>
      <span>#</span>
      <span>Street</span>
      <span>City</span>
      <span>Area</span>
      <span>Code</span>
    </div>
    <div class="addr-line"></div>
  `;
}

function renderRow(addr) {
  return `
    <div class="addr-row">
      <span>${addr.id}</span>
      <span>${addr.number}</span>
      <span>${addr.street}</span>
      <span>${addr.city} ${addr.country}</span>
      <span>${addr.area}</span>
      <span>${addr.postal}</span>
    </div>
  `;
}

function render() {
  return `
    <div class="addresses-container">
      ${renderHeader()}
      <div class="addr-body">
        ${addressState.addresses.map(renderRow).join("")}
      </div>
    </div>
  `;
}

// =====================
// UPDATE
// =====================

function update() {
  // Ajouter une nouvelle adresse
  addressState.addresses.push(createAddress());

  // Limiter le nombre d'adresses
  if (addressState.addresses.length > addressState.maxAddresses) {
    addressState.addresses.shift();
  }
}

// =====================
// INIT
// =====================

function initialize() {
  if (addressState.initialized) return;

  // Générer 20 adresses initiales
  for (let i = 0; i < 20; i++) {
    addressState.addresses.push(createAddress());
  }

  addressState.initialized = true;
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const addressesWindow = createFUIWindow({
  id: "dist-addresses",
  render,
  update,
  interval: 3000, // Nouvelle adresse toutes les 3 secondes
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startDISTAddresses() {
  initialize();
  addressesWindow.start();
  console.log("✅ DIST Addresses started");
}

export function stopDISTAddresses() {
  addressesWindow.stop();
  console.log("⏹️ DIST Addresses stopped");
}