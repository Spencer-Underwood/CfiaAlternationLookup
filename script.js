const rawData = {
    "PIPSC": {
        "CFIA-IN Group": {
            "CS-01": 90532, "CS-02": 107377, "CS-03": 128464, "CS-04": 147404, "CS-05": 177520 },
        "CFIA-S&A Group": {
            "CO-DEV": 74887, "CO-01": 89934, "CO-02": 124993, "CO-03": 138252, "CO-04": 149872,
            "EN-ENG-01": 67796, "EN-ENG-02": 82426, "EN-ENG-03": 107071, "EN-ENG-04": 119071, "EN-ENG-05": 141478, "EN-ENG-06": 153109,
            "ES-01": 73177, "ES-02": 80735, "ES-03": 97159, "ES-04": 115661, "ES-05": 131527, "ES-06": 147098, "ES-07": 158901,
            "PG-01": 70224, "PG-02": 79954, "PG-03": 89033, "PG-04": 105689, "PG-05": 122295, "PG-06": 133202,
            "SE-RES-01": 92504, "SE-RES-02": 130773, "SE-RES-03": 145111, "SE-RES-04": 161115, "SE-RES-05": 176369,
            "SE-REM-01": 146410, "SE-REM-02": 163483,
            "SR-01": 85443, "SR-02": 101416, "SR-03": 120292, "SR-04": 137707, "SR-05": 150294 },
        "CFIA-VM Group": {
            "VM-01": 116591, "VM-02": 135513, "VM-03": 141014, "VM-04": 151675, "VM-05": 165401 }
    },
    "PSAC": {
        "General":{
            "AS-01": 70829, "AS-02": 76036, "AS-03": 81499, "AS-04": 89278, "AS-05": 106647, "AS-06": 118531, "AS-07": 132244, "AS-08": 140565,
            "CR-01": 46717, "CR-02": 49042, "CR-03": 56150, "CR-04": 62249, "CR-05": 68241, "CR-06": 77395, "CR-07": 86215,
            "EG-01": 67753, "EG-02": 74530, "EG-03": 81975, "EG-04": 90176, "EG-05": 99195, "EG-06": 109111, "EG-07": 120028, "EG-08": 132030,
            "FI-01": 92100, "FI-02": 108410, "FI-03": 131472, "FI-04": 148759,
            "GT-01": 58890, "GT-02": 67813, "GT-03": 76073, "GT-04": 85943, "GT-05": 96469, "GT-06": 107247, "GT-07": 123009, "GT-08": 138975,
            "IS-01": 70829, "IS-02": 76036, "IS-03": 89278, "IS-04": 106647, "IS-05": 118531, "IS-06": 132244,
            "PM-01": 70829, "PM-02": 76036, "PM-03": 81499, "PM-04": 89278, "PM-05": 106647, "PM-06": 132244, "PM-07": 140565,
            "SI-01": 71529, "SI-02": 78925, "SI-03": 86031, "SI-04": 94981, "SI-05": 112945, "SI-06": 128577, "SI-07": 143802, "SI-08": 155655
        }
    }
};

// Flatten data
const flatData = [];
for (let union in rawData) {
    for (let group in rawData[union]) {
        for (let pos in rawData[union][group]) {
            flatData.push({ id: pos, salary: rawData[union][group][pos], union: union, group: group });
        }
    }
}

// Selectors
const searchBar = document.getElementById('searchBar');
const dropdown = document.getElementById('dropdownResults');
const resultsWrapper = document.getElementById('resultsWrapper');
const resultsBody = document.getElementById('resultsBody');
const masterBody = document.getElementById('masterBody');

// Table rendering helper
function renderTableRows(data, selectedId = null) {
    return data.map(item => `
        <tr class="${item.id === selectedId ? 'selected-row' : ''}">
            <td>${item.id}</td>
            <td>${item.union}</td>
            <td>${item.group}</td>
            <td>$${item.salary.toLocaleString()}</td>
        </tr>
    `).join('');
}

// Initial render of the reference table
masterBody.innerHTML = renderTableRows(flatData);

function updateResults(pos) {
    const min = pos.salary / 1.06;
    const max = pos.salary * 1.06;

    document.getElementById('selectedName').textContent = `${pos.id} ($${pos.salary.toLocaleString()})`;
    document.getElementById('rangeInfo').innerHTML = `<strong>ETP Range:</strong> $${Math.round(min).toLocaleString()} - $${Math.round(max).toLocaleString()}`;

    const matches = flatData
        .filter(p => p.salary >= min && p.salary <= max)
        .sort((a, b) => a.salary - b.salary);

    resultsBody.innerHTML = renderTableRows(matches, pos.id);
    resultsWrapper.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Search Logic
searchBar.addEventListener('input', () => {
    const val = searchBar.value.toLowerCase();
    if (val.length < 1) { dropdown.style.display = "none"; return; }

    const filtered = flatData.filter(p => p.id.toLowerCase().includes(val)).slice(0, 10);

    if (filtered.length > 0) {
        dropdown.innerHTML = filtered.map(p => `<div class="dropdown-item" data-id="${p.id}">${p.id}</div>`).join('');
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
});

// Click Handlers
document.addEventListener('click', (e) => {
    // Dropdown selection
    if (e.target.classList.contains('dropdown-item')) {
        const posId = e.target.getAttribute('data-id');
        const pos = flatData.find(p => p.id === posId);
        searchBar.value = pos.id;
        dropdown.style.display = "none";
        updateResults(pos);
    }
    // Master table row selection (Duddles' request)
    else if (e.target.closest('#masterBody tr')) {
        const row = e.target.closest('tr');
        const posId = row.cells[0].textContent.trim();
        const pos = flatData.find(p => p.id === posId);
        if (pos) {
            searchBar.value = pos.id;
            updateResults(pos);
        }
    } else {
        dropdown.style.display = "none";
    }
});