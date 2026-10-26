"use strict";

const STORAGE_KEY = "campuspark_vehicles_v1";

const $ = (id) => document.getElementById(id);

function createId() {
    return "vehicle_" + Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getVehicles() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "null"
        );

        if (Array.isArray(saved)) {
            return saved;
        }
    } catch (error) {
        console.error("Unable to load demo vehicles:", error);
    }

    const examples = [
        {
            id: createId(),
            type: "Sedan",
            make: "Toyota",
            model: "Vios",
            color: "White",
            plate: "ABC 1234",
            owner: "Student Demo",
            documentRef: "DEMO-001",
            status: "Verified",
            reason: "",
            createdAt: new Date().toISOString()
        },
        {
            id: createId(),
            type: "Motorcycle",
            make: "Honda",
            model: "Click 125",
            color: "Black",
            plate: "XYZ 5678",
            owner: "Student Demo",
            documentRef: "DEMO-002",
            status: "Pending",
            reason: "",
            createdAt: new Date().toISOString()
        }
    ];

    saveVehicles(examples);
    return examples;
}

function saveVehicles(vehicles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

function vehicleIcon(type) {
    return type === "Motorcycle" ? "🏍️" : "🚘";
}

function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString();
}

function showMessage(text, type) {
    const message = $("formMessage");

    if (!message) return;

    message.textContent = text;
    message.className = "message " + type;
    message.hidden = false;
}

function initMyVehicles() {
    const list = $("vehicleList");

    if (!list) return;

    function render() {
        const vehicles = getVehicles();
        const keyword = ($("vehicleSearch")?.value || "")
            .trim()
            .toLowerCase();

        const filtered = vehicles.filter(vehicle => {
            return [
                vehicle.plate,
                vehicle.make,
                vehicle.model,
                vehicle.type
            ].some(value =>
                String(value).toLowerCase().includes(keyword)
            );
        });

        $("totalCount").textContent = vehicles.length;

        $("verifiedCount").textContent = vehicles.filter(
            vehicle => vehicle.status === "Verified"
        ).length;

        $("pendingCount").textContent = vehicles.filter(
            vehicle => vehicle.status === "Pending"
        ).length;

        list.innerHTML = filtered.map(vehicle => `
            <article class="vehicle-card">
                <div class="vehicle-info">
                    <div class="vehicle-icon">
                        ${vehicleIcon(vehicle.type)}
                    </div>

                    <div>
                        <div class="vehicle-name">
                            ${escapeHTML(vehicle.make)}
                            ${escapeHTML(vehicle.model)}
                        </div>

                        <div class="vehicle-meta">
                            ${escapeHTML(vehicle.type)} ·
                            ${escapeHTML(vehicle.color)}<br>
                            Registered: ${formatDate(vehicle.createdAt)}
                        </div>
                    </div>
                </div>

                <div class="vehicle-actions">
                    <span class="plate">
                        ${escapeHTML(vehicle.plate)}
                    </span>

                    <span class="status ${vehicle.status.toLowerCase()}">
                        ${escapeHTML(vehicle.status)}
                    </span>

                    <button
                        class="text-button"
                        type="button"
                        data-delete="${escapeHTML(vehicle.id)}">
                        Remove
                    </button>
                </div>

                ${vehicle.reason ? `
                    <div class="vehicle-meta">
                        Admin note: ${escapeHTML(vehicle.reason)}
                    </div>
                ` : ""}
            </article>
        `).join("");

        $("emptyState").hidden = filtered.length !== 0;
    }

    $("vehicleSearch").addEventListener("input", render);

    list.addEventListener("click", event => {
        const button = event.target.closest("[data-delete]");

        if (!button) return;

        const vehicles = getVehicles();
        const id = button.dataset.delete;
        const vehicle = vehicles.find(item => item.id === id);

        if (!vehicle) return;

        if (!confirm(`Remove ${vehicle.plate} from this demo?`)) {
            return;
        }

        saveVehicles(vehicles.filter(item => item.id !== id));
        render();
    });

    window.addEventListener("storage", render);

    render();
}

function initAddVehicle() {
    const form = $("vehicleForm");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const data = new FormData(form);

        const vehicle = {
            type: String(data.get("type") || "").trim(),
            make: String(data.get("make") || "").trim(),
            model: String(data.get("model") || "").trim(),
            color: String(data.get("color") || "").trim(),
            plate: String(data.get("plate") || "")
                .trim()
                .toUpperCase()
                .replace(/\s+/g, " "),
            owner: String(data.get("owner") || "").trim(),
            documentRef: String(data.get("documentRef") || "").trim()
        };

        if (Object.values(vehicle).some(value => !value)) {
            showMessage(
                "Please complete all required fields.",
                "error"
            );
            return;
        }

        if (
            vehicle.plate.length < 3 ||
            vehicle.plate.length > 15 ||
            !/^[A-Z0-9 -]+$/.test(vehicle.plate)
        ) {
            showMessage(
                "Enter a valid plate number using 3–15 letters, numbers, spaces, or hyphens.",
                "error"
            );
            return;
        }

        const vehicles = getVehicles();

        const duplicate = vehicles.some(
            item => item.plate.toUpperCase() === vehicle.plate
        );

        if (duplicate) {
            showMessage(
                "This plate number is already registered in the demo.",
                "error"
            );
            return;
        }

        vehicles.unshift({
            ...vehicle,
            id: createId(),
            status: "Pending",
            reason: "",
            createdAt: new Date().toISOString()
        });

        saveVehicles(vehicles);

        showMessage(
            "Vehicle submitted successfully! Status: Pending verification.",
            "success"
        );

        form.reset();

        setTimeout(() => {
            window.location.href = "my-vehicles.html";
        }, 900);
    });
}

function initAdminVerification() {
    const list = $("adminVehicleList");

    if (!list) return;

    let rejectVehicleId = null;

    function render() {
        const vehicles = getVehicles();
        const filter = $("statusFilter").value;

        $("adminPendingCount").textContent = vehicles.filter(
            vehicle => vehicle.status === "Pending"
        ).length;

        $("adminVerifiedCount").textContent = vehicles.filter(
            vehicle => vehicle.status === "Verified"
        ).length;

        $("adminRejectedCount").textContent = vehicles.filter(
            vehicle => vehicle.status === "Rejected"
        ).length;

        const filtered = vehicles.filter(vehicle =>
            filter === "All" || vehicle.status === filter
        );

        list.innerHTML = filtered.map(vehicle => `
            <article class="vehicle-card">
                <div class="vehicle-info">
                    <div class="vehicle-icon">
                        ${vehicleIcon(vehicle.type)}
                    </div>

                    <div>
                        <div class="vehicle-name">
                            ${escapeHTML(vehicle.make)}
                            ${escapeHTML(vehicle.model)}
                        </div>

                        <p>
                            <span class="plate">
                                ${escapeHTML(vehicle.plate)}
                            </span>
                        </p>

                        <span class="status ${vehicle.status.toLowerCase()}">
                            ${escapeHTML(vehicle.status)}
                        </span>

                        <div class="vehicle-meta">
                            Type: ${escapeHTML(vehicle.type)}<br>
                            Color: ${escapeHTML(vehicle.color)}<br>
                            Registered owner: ${escapeHTML(vehicle.owner)}<br>
                            Document reference: ${escapeHTML(vehicle.documentRef)}<br>
                            Submitted: ${formatDate(vehicle.createdAt)}
                            ${vehicle.reason ? `
                                <br>Rejection reason:
                                ${escapeHTML(vehicle.reason)}
                            ` : ""}
                        </div>
                    </div>
                </div>

                <div class="admin-buttons">
                    <button
                        type="button"
                        class="btn primary"
                        data-approve="${escapeHTML(vehicle.id)}"
                        ${vehicle.status === "Verified" ? "disabled" : ""}>
                        ✓ Verify
                    </button>

                    <button
                        type="button"
                        class="btn danger"
                        data-reject="${escapeHTML(vehicle.id)}"
                        ${vehicle.status === "Rejected" ? "disabled" : ""}>
                        Reject
                    </button>
                </div>
            </article>
        `).join("");

        $("adminEmpty").hidden = filtered.length !== 0;
    }

    function closeModal() {
        $("rejectModal").hidden = true;
        rejectVehicleId = null;
    }

    list.addEventListener("click", event => {
        const approveButton = event.target.closest("[data-approve]");
        const rejectButton = event.target.closest("[data-reject]");

        if (approveButton) {
            const vehicles = getVehicles();

            const vehicle = vehicles.find(
                item => item.id === approveButton.dataset.approve
            );

            if (!vehicle || vehicle.status === "Verified") {
                return;
            }

            vehicle.status = "Verified";
            vehicle.reason = "";
            vehicle.reviewedAt = new Date().toISOString();

            saveVehicles(vehicles);
            render();
        }

        if (rejectButton) {
            rejectVehicleId = rejectButton.dataset.reject;

            $("rejectReason").value = "";
            $("rejectModal").hidden = false;
            $("rejectReason").focus();
        }
    });

    $("cancelReject").addEventListener("click", closeModal);

    $("rejectModal").addEventListener("click", event => {
        if (event.target === $("rejectModal")) {
            closeModal();
        }
    });

    $("confirmReject").addEventListener("click", () => {
        const reason = $("rejectReason").value.trim();

        if (!reason) {
            alert("Please enter a rejection reason.");
            $("rejectReason").focus();
            return;
        }

        const vehicles = getVehicles();

        const vehicle = vehicles.find(
            item => item.id === rejectVehicleId
        );

        if (!vehicle) {
            closeModal();
            return;
        }

        vehicle.status = "Rejected";
        vehicle.reason = reason;
        vehicle.reviewedAt = new Date().toISOString();

        saveVehicles(vehicles);

        closeModal();
        render();
    });

    $("statusFilter").addEventListener("change", render);

    window.addEventListener("storage", render);

    render();
}

getVehicles();
initMyVehicles();
initAddVehicle();
initAdminVerification();
