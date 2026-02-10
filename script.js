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

const flatData = [];
for (let union in rawData) {
    for (let group in rawData[union]) {
        for (let pos in rawData[union][group]) {
            flatData.push({ id: pos, salary: rawData[union][group][pos], union: union, group: group });
        }
    }
}

const searchBar = document.getElementById('searchBar');
const dropdown = document.getElementById('dropdownResults');
const masterBody = document.getElementById('masterBody');
const resultsBody = document.getElementById('resultsBody');
const resultsWrapper = document.getElementById('resultsWrapper');

function renderTableRows(data, selectedId = null) {
    return data.map(p => `
        <tr id="${p.id === selectedId ? 'selected-row-anchor' : ''}" class="${p.id === selectedId ? 'match-row' : ''}">
            <td>${p.id}</td>
            <td><span class="tag">${p.union}</span></td>
            <td>${p.group}</td>
            <td>$${p.salary.toLocaleString()}</td>
        </tr>
    `).join('');
}

// Master table stays in JSON order
masterBody.innerHTML = renderTableRows(flatData);

searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toUpperCase();
    if (!term) { dropdown.style.display = "none"; return; }
    const matches = flatData.filter(p => p.id.includes(term));
    dropdown.innerHTML = matches.map(m => `<div class="dropdown-item" data-id="${m.id}">${m.id} ($${m.salary.toLocaleString()})</div>`).join('');
    dropdown.style.display = matches.length ? "block" : "none";
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown-item')) {
        const posId = e.target.getAttribute('data-id');
        const pos = flatData.find(p => p.id === posId);
        searchBar.value = pos.id;
        dropdown.style.display = "none";

        const min = pos.salary * 0.94;
        const max = pos.salary * 1.06;

        document.getElementById('selectedName').textContent = `${pos.id} ($${pos.salary.toLocaleString()})`;
        document.getElementById('rangeInfo').innerHTML = `Equivalence Range (±6%): $${Math.round(min).toLocaleString()} - $${Math.round(max).toLocaleString()}`;

        // RESULTS SORTING: Sort by salary ascending (lowest at top, highest at bottom)
        const matches = flatData
            .filter(p => p.salary >= min && p.salary <= max)
            .sort((a, b) => a.salary - b.salary);

        resultsBody.innerHTML = renderTableRows(matches, pos.id);
        resultsWrapper.style.display = "block";

        // Auto-scroll to the highlighted position so it's "centered" in the view
        const anchor = document.getElementById('selected-row-anchor');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        dropdown.style.display = "none";
    }
});