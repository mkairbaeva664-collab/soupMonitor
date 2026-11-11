import Chart from 'chart.js/auto'
import './style.css'
import { runs } from './data.js';
import { downsampleData } from './utils.js'; 

// Display table
function showTable(data) {
    const tableRows = data.map(run => `
        <tr>
            <td>${run.id}</td>
            <td>${run.name}</td>
            <td>${run.status}</td>
            <td>${run.loss}</td>
            <td>${run.steps}</td>
            <td>
                <button class="btn btn-sm btn-primary"
                    onclick="openRun(${run.id})">
                    View
                </button>
            </td>
        </tr>
    `).join('')

    document.querySelector('#tableBody').innerHTML = tableRows
}

// Filter by status
function filterRuns() {
    const status = document.querySelector('#statusFilter').value

    let filteredRuns = runs

    if (status !== 'All') {
        filteredRuns = runs.filter(run => run.status === status)
    }

    showTable(filteredRuns)
}

// Sort by Loss
function sortRuns() {
    const sortedRuns = [...runs].sort((a, b) => a.loss - b.loss)
    showTable(sortedRuns)
}

let charts = []

function openRun(id) {
    const run = runs.find(item => item.id === id)

    // Remove old charts
    charts.forEach(chart => chart.destroy())
    charts = []

    document.querySelector('#app').innerHTML = `
        <div class="container mt-5">

            <button class="btn btn-secondary mb-4" id="backButton">
                Back to Runs
            </button>

            <h1>${run.name}</h1>
            <p class="text-secondary">Training Run Details</p>

            <div class="row g-3 mb-4">

                <div class="col-md-4">
                    <div class="card p-3">
                        <h6>Last Loss</h6>
                        <h3>${run.loss}</h3>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <h6>Status</h6>
                        <h3>${run.status}</h3>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <h6>Total Steps</h6>
                        <h3>${run.steps}</h3>
                    </div>
                </div>

            </div>

            <div class="card p-3 mb-4">
                <h4>Loss</h4>
                <canvas id="lossChart"></canvas>
            </div>

            <div class="card p-3 mb-4">
                <h4>Learning Rate</h4>
                <canvas id="lrChart"></canvas>
            </div>

            <div class="card p-3 mb-4">
                <h4>Gradient Norm</h4>
                <canvas id="gradChart"></canvas>
            </div>

        </div>
    `

    document.querySelector('#backButton')
        .addEventListener('click', () => {
            showMainPage()
        })

    const sampledLoss = downsampleData(run.stepsData, run.lossData, 1000);
    const sampledLr = downsampleData(run.stepsData, run.lrData, 1000);
    const sampledGrad = downsampleData(run.stepsData, run.gradData, 1000);

    createChart('lossChart', 'Loss', sampledLoss.steps, sampledLoss.values);
    createChart('lrChart', 'Learning Rate', sampledLr.steps, sampledLr.values);
    createChart('gradChart', 'Gradient Norm', sampledGrad.steps, sampledGrad.values);
}

function createChart(canvasId, title, steps, values) {
    const chart = new Chart(
        document.getElementById(canvasId),
        {
            type: 'line',
            data: {
                labels: steps,
                datasets: [{
                    label: title,
                    data: values,
                    borderColor: '#4f46e5',
                    backgroundColor: '#4f46e5',
                    borderWidth: 2,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Training Steps'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: title
                        }
                    }
                }
            }
        }
    )

    charts.push(chart)
}

function showMainPage() {
    document.querySelector('#app').innerHTML = `
        <div class="container mt-5">
            <h1>ML Training Monitor</h1>
            <p class="text-secondary">Monitor your machine learning training runs.</p>

            <h3 class="mt-4 mb-3">Training Runs</h3>

            <div class="d-flex gap-2 mb-3">
                <select id="statusFilter" class="form-select w-auto">
                    <option value="All">All statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Running">Running</option>
                    <option value="Failed">Failed</option>
                </select>

                <button class="btn btn-dark" id="sortButton">
                    Sort by Loss
                </button>
            </div>

            <div class="table-responsive">
                <table class="table table-bordered table-hover bg-white">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Run Name</th>
                            <th>Status</th>
                            <th>Loss</th>
                            <th>Steps</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody"></tbody>
                </table>
            </div>
        </div>
    `

    document.querySelector('#statusFilter')
        .addEventListener('change', filterRuns)

    document.querySelector('#sortButton')
        .addEventListener('click', sortRuns)

    showTable(runs)
}

// Make function available for buttons
window.openRun = openRun
showMainPage()