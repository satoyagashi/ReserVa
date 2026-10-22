import { createContext, useContext, useState } from "react";

/*
  WHAT IS THIS FILE?
  Our pages (Dashboard, Zones, Slots, Reservations) all need the same data.
  This file keeps that data in ONE place and gives every page access to it.

  It has 3 parts:
    1. Starting (sample) data
    2. Functions that change the data (add, edit, delete)
    3. A "Provider" that shares the data and functions with all pages

  Every page gets it with one line:
    const { zones, addZone } = useParking();
*/

// This creates the "shared box". Don't worry about the details.
const ParkingContext = createContext(null);

// Pages call this function to open the shared box and take what they need.
export function useParking() {
  return useContext(ParkingContext);
}

// ------------------------------------------------------------
// PART 1: STARTING DATA (fake data for now, until you have a database)
// ------------------------------------------------------------

// Today's date as text, like "2026-10-23"
const today = new Date().toISOString().slice(0, 10);

const startingZones = [
  { id: 1, name: "Zone A", location: "Main Gate", vehicleType: "Car", capacity: 6 },
  { id: 2, name: "Zone B", location: "Library", vehicleType: "Motorcycle", capacity: 4 },
  { id: 3, name: "Zone C", location: "Gymnasium", vehicleType: "Bicycle", capacity: 3 },
];

// Each slot belongs to a zone. "zoneId" points to the id of a zone above.
const startingSlots = [
  { id: 1, code: "A-01", zoneId: 1 },
  { id: 2, code: "A-02", zoneId: 1 },
  { id: 3, code: "A-03", zoneId: 1 },
  { id: 4, code: "A-04", zoneId: 1 },
  { id: 5, code: "A-05", zoneId: 1 },
  { id: 6, code: "B-01", zoneId: 2 },
  { id: 7, code: "B-02", zoneId: 2 },
  { id: 8, code: "B-03", zoneId: 2 },
  { id: 9, code: "C-01", zoneId: 3 },
  { id: 10, code: "C-02", zoneId: 3 },
];

// Each reservation belongs to a slot. "slotId" points to the id of a slot above.
// status can be: "reserved", "occupied", "expired" or "cancelled"
const startingReservations = [
  { id: 1, user: "Maria Santos", plate: "ABC 123", slotId: 1, date: today, start: "08:00", end: "12:00", status: "occupied" },
  { id: 2, user: "John Reyes", plate: "XYZ 456", slotId: 2, date: today, start: "09:00", end: "11:00", status: "reserved" },
  { id: 3, user: "Ana Cruz", plate: "MOT 789", slotId: 6, date: today, start: "07:30", end: "17:00", status: "occupied" },
  { id: 4, user: "Leo Garcia", plate: "CAR 321", slotId: 3, date: today, start: "06:00", end: "08:00", status: "expired" },
  { id: 5, user: "Mia Lopez", plate: "BIK 001", slotId: 9, date: today, start: "13:00", end: "15:00", status: "reserved" },
  { id: 6, user: "Paul Tan", plate: "DEF 654", slotId: 4, date: today, start: "10:00", end: "12:00", status: "cancelled" },
];

// ------------------------------------------------------------
// PART 2 and 3: THE PROVIDER (holds the data + the functions)
// ------------------------------------------------------------

export function ParkingProvider({ children }) {
  /*
    useState keeps data that React watches.
    When we change it with the "set" function, the screen updates by itself.

    const [zones, setZones] = useState(startingZones);
          ^data  ^function to change it   ^starting value
  */
  const [zones, setZones] = useState(startingZones);
  const [slots, setSlots] = useState(startingSlots);
  const [reservations, setReservations] = useState(startingReservations);

  /*
    Array tricks used below (all of them make a NEW list, they never edit the old one):

    list.find(...)    -> get the FIRST item that matches
    list.filter(...)  -> keep only the items that match (used to DELETE: keep everything except one)
    list.map(...)     -> go through every item and change some (used to EDIT)
    [...list, item]   -> a copy of the list with one more item at the end (used to ADD)
  */

  // Makes a unique id for new items (the current time in milliseconds is always different)
  function makeId() {
    return Date.now();
  }

  // ---------- Finding things ----------

  function getZone(zoneId) {
    return zones.find(function (zone) {
      return zone.id === zoneId;
    });
  }

  function getSlot(slotId) {
    return slots.find(function (slot) {
      return slot.id === slotId;
    });
  }

  // A slot is:
  //   "occupied"  if someone with an "occupied" reservation is using it
  //   "reserved"  if it has a "reserved" reservation
  //   "available" otherwise
  // Expired and cancelled reservations don't block a slot.
  function slotStatus(slotId) {
    let status = "available";

    for (const reservation of reservations) {
      if (reservation.slotId !== slotId) continue; // not about this slot, skip it

      if (reservation.status === "occupied") {
        return "occupied"; // occupied wins, we can stop here
      }
      if (reservation.status === "reserved") {
        status = "reserved";
      }
    }

    return status;
  }

  // ---------- Zones ----------

  function addZone(newZone) {
    const zoneWithId = { ...newZone, id: makeId() }; // copy the zone and add an id
    setZones([...zones, zoneWithId]);
  }

  function updateZone(zoneId, changes) {
    const updatedList = zones.map(function (zone) {
      if (zone.id === zoneId) {
        return { ...zone, ...changes }; // this is the one: apply the changes
      }
      return zone; // not this one: leave it alone
    });
    setZones(updatedList);
  }

  function deleteZone(zoneId) {
    // Find the slots inside this zone, because they must be deleted too
    const slotsInZone = slots.filter(function (slot) {
      return slot.zoneId === zoneId;
    });
    const slotIdsInZone = slotsInZone.map(function (slot) {
      return slot.id;
    });

    // Keep everything EXCEPT the zone, its slots, and their reservations
    setZones(zones.filter((zone) => zone.id !== zoneId));
    setSlots(slots.filter((slot) => slot.zoneId !== zoneId));
    setReservations(reservations.filter((r) => !slotIdsInZone.includes(r.slotId)));
  }

  // ---------- Slots ----------

  function addSlot(newSlot) {
    const slotWithId = { ...newSlot, id: makeId() };
    setSlots([...slots, slotWithId]);
  }

  function updateSlot(slotId, changes) {
    const updatedList = slots.map(function (slot) {
      if (slot.id === slotId) {
        return { ...slot, ...changes };
      }
      return slot;
    });
    setSlots(updatedList);
  }

  function deleteSlot(slotId) {
    setSlots(slots.filter((slot) => slot.id !== slotId));
    // Also remove reservations that belonged to this slot
    setReservations(reservations.filter((r) => r.slotId !== slotId));
  }

  // ---------- Reservations ----------

  function setReservationStatus(reservationId, newStatus) {
    const updatedList = reservations.map(function (reservation) {
      if (reservation.id === reservationId) {
        return { ...reservation, status: newStatus };
      }
      return reservation;
    });
    setReservations(updatedList);
  }

  function deleteReservation(reservationId) {
    setReservations(reservations.filter((r) => r.id !== reservationId));
  }

  // ---------- Share everything with the pages ----------
  // Anything listed here can be used by any page with useParking().
  const sharedStuff = {
    // data
    zones,
    slots,
    reservations,

    // finding things
    getZone,
    getSlot,
    slotStatus,

    // changing things
    addZone,
    updateZone,
    deleteZone,
    addSlot,
    updateSlot,
    deleteSlot,
    setReservationStatus,
    deleteReservation,
  };

  // "children" is the rest of your app (set up in App.jsx).
  // Wrapping it in the Provider lets all of it use the shared data.
  return <ParkingContext.Provider value={sharedStuff}>{children}</ParkingContext.Provider>;
}
