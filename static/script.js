// Global variables
let productionChart = null;
let allProductions = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadOverviewData();
    setupFormSubmission();
});

// Show/hide pages
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to clicked nav link
    event.target.classList.add('active');
    
    // Load data based on page
    if (pageId === 'overview') {
        loadOverviewData();
    } else if (pageId === 'productions') {
        loadProductionsData();
    }
}

// Load overview data
async function loadOverviewData() {
    try {
        const response = await fetch('/api/productions/summary');
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            // Update metrics
            document.getElementById('total-productions').textContent = data.total_productions;
            document.getElementById('total-value').textContent = formatCurrency(data.total_value);
            document.getElementById('total-pieces').textContent = data.total_pieces;
            
            // Update chart
            updateProductionChart(data.productions);
        } else {
            console.error('Erro ao carregar dados:', result.error);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Load productions data
async function loadProductionsData() {
    try {
        const response = await fetch('/api/productions');
        const result = await response.json();
        
        if (result.success) {
            allProductions = result.data;
            displayProductions(allProductions);
        } else {
            console.error('Erro ao carregar produções:', result.error);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Display productions
function displayProductions(productions) {
    const container = document.getElementById('productions-list');
    container.innerHTML = '';
    
    productions.forEach(production => {
        const card = createProductionCard(production);
        container.appendChild(card);
    });
}

// Create production card
function createProductionCard(production) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const valorPedido = production['VALOR PEDIDO'] || 0;
    const quantidadePecas = production['QUANTIDADE DE PEÇAS'] || 0;
    const nomeTecido = production['NOME DO TECIDO'] || 'N/A';
    const data = production['DATA'] || 'N/A';
    const pagamentos = production['PAGAMENTOS'] || 'N/A';
    
    col.innerHTML = `
        <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">${production.ID_PRODUCAO}</h6>
                <small class="text-muted">${data}</small>
            </div>
            <div class="card-body">
                <h5 class="card-title">${nomeTecido}</h5>
                <div class="mb-2">
                    <strong>Valor do Pedido:</strong> ${formatCurrency(valorPedido)}
                </div>
                <div class="mb-2">
                    <strong>Quantidade:</strong> ${quantidadePecas} peças
                </div>
                <div class="mb-2">
                    <strong>Pagamentos:</strong> ${pagamentos}
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-sm" onclick="showProductionDetails('${production.ID_PRODUCAO}')">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                <button class="btn btn-secondary btn-sm ms-2" onclick="showEditProductionModal('${production.ID_PRODUCAO}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        </div>
    `;
    
    return col;
}

// Show production details
async function showProductionDetails(productionId) {
    try {
        const response = await fetch(`/api/productions/costs/${productionId}`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            showCostsModal(data);
        } else {
            alert('Erro ao carregar detalhes da produção');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao carregar detalhes da produção');
    }
}

// Show costs modal
function showCostsModal(data) {
    const modalHtml = `
        <div class="modal fade" id="costsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalhes de Custos - ${data.production_id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Custos de Produção</h6>
                                ${Object.entries(data.costs).map(([key, value]) => `
                                    <div class="cost-item">
                                        <span>${key}:</span>
                                        <span>${formatCurrency(value)}</span>
                                    </div>
                                `).join('')}
                                <div class="cost-item">
                                    <span><strong>Total:</strong></span>
                                    <span><strong>${formatCurrency(data.total_cost)}</strong></span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6>Informações do Pedido</h6>
                                <div class="cost-item">
                                    <span>Valor do Pedido:</span>
                                    <span>${formatCurrency(data.valor_pedido)}</span>
                                </div>
                                <div class="cost-item">
                                    <span>Quantidade de Peças:</span>
                                    <span>${data.quantidade_pecas}</span>
                                </div>
                                <div class="cost-item">
                                    <span>Pagamentos:</span>
                                    <span>${data.pagamentos || 'N/A'}</span>
                                </div>
                                <div class="cost-item">
                                    <span><strong>Lucro:</strong></span>
                                    <span><strong>${formatCurrency(data.valor_pedido - data.total_cost)}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('costsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('costsModal'));
    modal.show();
}

// Show edit production modal
async function showEditProductionModal(productionId) {
    try {
        const response = await fetch(`/api/productions/${productionId}`);
        const result = await response.json();

        if (result.success) {
            const production = result.data;
            
            const modalHtml = `
                <div class="modal fade" id="editProductionModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Editar Produção - ${production.ID_PRODUCAO}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="edit-production-form">
                                    <input type="hidden" id="edit-production-id" value="${production.ID_PRODUCAO}">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="edit-data" class="form-label">Data *</label>
                                                <input type="date" class="form-control" id="edit-data" value="${production.DATA || ''}" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="edit-nome-tecido" class="form-label">Nome do Tecido *</label>
                                                <input type="text" class="form-control" id="edit-nome-tecido" value="${production['NOME DO TECIDO'] || ''}" required>
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="mb-3">Custos de Produção</h5>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-corte" class="form-label">Corte</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-corte" value="${production.CORTE || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-faccao" class="form-label">Facção</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-faccao" value="${production.FACÇÃO || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-travet" class="form-label">Travet</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-travet" value="${production.TRAVET || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-ziper" class="form-label">Zíper</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-ziper" value="${production.ZIPER || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-botao" class="form-label">Botão</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-botao" value="${production.BOTÃO || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-aprontamento" class="form-label">Aprontamento</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-aprontamento" value="${production.APRONTAMENTO || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-lavanderia" class="form-label">Lavanderia</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-lavanderia" value="${production.LAVANDERIA || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-bolsa" class="form-label">Bolsa</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-bolsa" value="${production.BOLSA || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-limpado" class="form-label">Limpado</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-limpado" value="${production.LIMPADO || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-tag-etiqueta" class="form-label">Tag + Etiqueta</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-tag-etiqueta" value="${production['TAG + ETIQUETA'] || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-metragem-tecido" class="form-label">Metragem do Tecido</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-metragem-tecido" value="${production['METRAGEM DO TECIDO'] || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-preco-tecido" class="form-label">Preço do Tecido</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-preco-tecido" value="${production['PREÇO DO TECIDO'] || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="mb-3">Informações do Pedido</h5>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-quantidade-pecas" class="form-label">Quantidade de Peças *</label>
                                                <input type="number" class="form-control" id="edit-quantidade-pecas" value="${production['QUANTIDADE DE PEÇAS'] || 0}" required>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-valor-pedido" class="form-label">Valor do Pedido *</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-valor-pedido" value="${production['VALOR PEDIDO'] || 0}" required>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-pagamentos" class="form-label">Pagamentos</label>
                                                <input type="text" class="form-control" id="edit-pagamentos" value="${production.PAGAMENTOS || ''}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-end">
                                        <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal
            const existingModal = document.getElementById("editProductionModal");
            if (existingModal) {
                existingModal.remove();
            }

            // Add new modal
            document.body.insertAdjacentHTML("beforeend", modalHtml);

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById("editProductionModal"));
            modal.show();

            // Setup form submission for edit form
            setupEditFormSubmission();

        } else {
            alert("Erro ao carregar dados da produção para edição: " + result.error);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao carregar dados da produção para edição");
    }
}

// Setup form submission for edit form
function setupEditFormSubmission() {
    const form = document.getElementById("edit-production-form");
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const productionId = document.getElementById("edit-production-id").value;
            const formData = {
                "DATA": document.getElementById("edit-data").value,
                "NOME DO TECIDO": document.getElementById("edit-nome-tecido").value,
                "CORTE": parseFloat(document.getElementById("edit-corte").value) || 0,
                "FACÇÃO": parseFloat(document.getElementById("edit-faccao").value) || 0,
                "TRAVET": parseFloat(document.getElementById("edit-travet").value) || 0,
                "ZIPER": parseFloat(document.getElementById("edit-ziper").value) || 0,
                "BOTÃO": parseFloat(document.getElementById("edit-botao").value) || 0,
                "APRONTAMENTO": parseFloat(document.getElementById("edit-aprontamento").value) || 0,
                "LAVANDERIA": parseFloat(document.getElementById("edit-lavanderia").value) || 0,
                "BOLSA": parseFloat(document.getElementById("edit-bolsa").value) || 0,
                "LIMPADO": parseFloat(document.getElementById("edit-limpado").value) || 0,
                "TAG + ETIQUETA": parseFloat(document.getElementById("edit-tag-etiqueta").value) || 0,
                "METRAGEM DO TECIDO": parseFloat(document.getElementById("edit-metragem-tecido").value) || 0,
                "PREÇO DO TECIDO": parseFloat(document.getElementById("edit-preco-tecido").value) || 0,
                "QUANTIDADE DE PEÇAS": parseInt(document.getElementById("edit-quantidade-pecas").value) || 0,
                "VALOR PEDIDO": parseFloat(document.getElementById("edit-valor-pedido").value) || 0,
                "PAGAMENTOS": document.getElementById("edit-pagamentos").value
            };
            
            try {
                const response = await fetch(`/api/productions/${productionId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert("Produção atualizada com sucesso!");
                    // Close modal
                    const modalElement = document.getElementById("editProductionModal");
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                    
                    // Reload data
                    loadProductionsData();
                    loadOverviewData();
                } else {
                    alert("Erro ao atualizar produção: " + result.error);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Erro ao atualizar produção");
            }
        });
    }
}

// Update production chart
function updateProductionChart(productions) {
    const ctx = document.getElementById('productionChart').getContext('2d');
    
    // Destroy existing chart
    if (productionChart) {
        productionChart.destroy();
    }
    
    const labels = productions.map(p => p.id);
    const values = productions.map(p => p.valor_pedido);
    
    productionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor do Pedido (R$)',
                data: values,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Valor: R$ ' + context.parsed.y.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('production-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            'DATA': document.getElementById('data').value,
            'NOME DO TECIDO': document.getElementById('nome-tecido').value,
            'CORTE': parseFloat(document.getElementById('corte').value) || 0,
            'FACÇÃO': parseFloat(document.getElementById('faccao').value) || 0,
            'TRAVET': parseFloat(document.getElementById('travet').value) || 0,
            'ZIPER': parseFloat(document.getElementById('ziper').value) || 0,
            'BOTÃO': parseFloat(document.getElementById('botao').value) || 0,
            'APRONTAMENTO': parseFloat(document.getElementById('aprontamento').value) || 0,
            'LAVANDERIA': parseFloat(document.getElementById('lavanderia').value) || 0,
            'BOLSA': parseFloat(document.getElementById('bolsa').value) || 0,
            'LIMPADO': parseFloat(document.getElementById('limpado').value) || 0,
            'TAG + ETIQUETA': parseFloat(document.getElementById('tag-etiqueta').value) || 0,
            'METRAGEM DO TECIDO': parseFloat(document.getElementById('metragem-tecido').value) || 0,
            'PREÇO DO TECIDO': parseFloat(document.getElementById('preco-tecido').value) || 0,
            'QUANTIDADE DE PEÇAS': parseInt(document.getElementById('quantidade-pecas').value) || 0,
            'VALOR PEDIDO': parseFloat(document.getElementById('valor-pedido').value) || 0,
            'PAGAMENTOS': document.getElementById('pagamentos').value
        };
        
        try {
            const response = await fetch('/api/productions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Produção adicionada com sucesso!');
                form.reset();
                // Reload overview data
                loadOverviewData();
            } else {
                alert('Erro ao adicionar produção: ' + result.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao adicionar produção');
        }
    });
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}



// Show edit production modal
async function showEditProductionModal(productionId) {
    try {
        const response = await fetch(`/api/productions/${productionId}`);
        const result = await response.json();

        if (result.success) {
            const production = result.data;
            
            const modalHtml = `
                <div class="modal fade" id="editProductionModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Editar Produção - ${production.ID_PRODUCAO}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="edit-production-form">
                                    <input type="hidden" id="edit-production-id" value="${production.ID_PRODUCAO}">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="edit-data" class="form-label">Data *</label>
                                                <input type="date" class="form-control" id="edit-data" value="${production.DATA || ''}" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="edit-nome-tecido" class="form-label">Nome do Tecido *</label>
                                                <input type="text" class="form-control" id="edit-nome-tecido" value="${production['NOME DO TECIDO'] || ''}" required>
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="mb-3">Custos de Produção</h5>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-corte" class="form-label">Corte</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-corte" value="${production.CORTE || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-faccao" class="form-label">Facção</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-faccao" value="${production.FACÇÃO || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-travet" class="form-label">Travet</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-travet" value="${production.TRAVET || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-ziper" class="form-label">Zíper</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-ziper" value="${production.ZIPER || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-botao" class="form-label">Botão</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-botao" value="${production.BOTÃO || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-aprontamento" class="form-label">Aprontamento</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-aprontamento" value="${production.APRONTAMENTO || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-lavanderia" class="form-label">Lavanderia</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-lavanderia" value="${production.LAVANDERIA || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-bolsa" class="form-label">Bolsa</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-bolsa" value="${production.BOLSA || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-limpado" class="form-label">Limpado</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-limpado" value="${production.LIMPADO || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="edit-tag-etiqueta" class="form-label">Tag + Etiqueta</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-tag-etiqueta" value="${production['TAG + ETIQUETA'] || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="mb-3">Informações do Tecido</h5>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-metragem-tecido" class="form-label">Metragem do Tecido</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-metragem-tecido" value="${production['METRAGEM DO TECIDO'] || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-preco-tecido" class="form-label">Preço do Tecido</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-preco-tecido" value="${production['PREÇO DO TECIDO'] || 0}">
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="mb-3">Informações do Pedido</h5>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-quantidade-pecas" class="form-label">Quantidade de Peças *</label>
                                                <input type="number" class="form-control" id="edit-quantidade-pecas" value="${production['QUANTIDADE DE PEÇAS'] || 0}" required>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-valor-pedido" class="form-label">Valor do Pedido</label>
                                                <input type="number" step="0.01" class="form-control" id="edit-valor-pedido" value="${production['VALOR PEDIDO'] || 0}">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="edit-pagamentos" class="form-label">Pagamentos</label>
                                                <input type="text" class="form-control" id="edit-pagamentos" value="${production.PAGAMENTOS || ''}" placeholder="Ex: 04/06- 2300">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="text-end">
                                        <button type="submit" class="btn btn-success btn-lg">
                                            <i class="fas fa-edit"></i> Salvar Alterações
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal
            const existingModal = document.getElementById("editProductionModal");
            if (existingModal) {
                existingModal.remove();
            }

            // Add new modal
            document.body.insertAdjacentHTML("beforeend", modalHtml);

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById("editProductionModal"));
            modal.show();

            // Setup form submission for edit form
            setupEditFormSubmission();

        } else {
            alert("Erro ao carregar dados da produção para edição: " + result.error);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao carregar dados da produção para edição");
    }
}

// Setup form submission for edit form
function setupEditFormSubmission() {
    const form = document.getElementById("edit-production-form");
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const productionId = document.getElementById("edit-production-id").value;
            const formData = {
                "DATA": document.getElementById("edit-data").value,
                "NOME DO TECIDO": document.getElementById("edit-nome-tecido").value,
                "CORTE": parseFloat(document.getElementById("edit-corte").value) || 0,
                "FACÇÃO": parseFloat(document.getElementById("edit-faccao").value) || 0,
                "TRAVET": parseFloat(document.getElementById("edit-travet").value) || 0,
                "ZIPER": parseFloat(document.getElementById("edit-ziper").value) || 0,
                "BOTÃO": parseFloat(document.getElementById("edit-botao").value) || 0,
                "APRONTAMENTO": parseFloat(document.getElementById("edit-aprontamento").value) || 0,
                "LAVANDERIA": parseFloat(document.getElementById("edit-lavanderia").value) || 0,
                "BOLSA": parseFloat(document.getElementById("edit-bolsa").value) || 0,
                "LIMPADO": parseFloat(document.getElementById("edit-limpado").value) || 0,
                "TAG + ETIQUETA": parseFloat(document.getElementById("edit-tag-etiqueta").value) || 0,
                "METRAGEM DO TECIDO": parseFloat(document.getElementById("edit-metragem-tecido").value) || 0,
                "PREÇO DO TECIDO": parseFloat(document.getElementById("edit-preco-tecido").value) || 0,
                "QUANTIDADE DE PEÇAS": parseInt(document.getElementById("edit-quantidade-pecas").value) || 0,
                "VALOR PEDIDO": parseFloat(document.getElementById("edit-valor-pedido").value) || 0,
                "PAGAMENTOS": document.getElementById("edit-pagamentos").value
            };
            
            try {
                const response = await fetch(`/api/productions/${productionId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert("Produção atualizada com sucesso!");
                    // Close modal
                    const modalElement = document.getElementById("editProductionModal");
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                    
                    // Reload data
                    loadProductionsData();
                    loadOverviewData();
                } else {
                    alert("Erro ao atualizar produção: " + result.error);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Erro ao atualizar produção");
            }
        });
    }
}

// Modify createProductionCard to include an edit button
const originalCreateProductionCard = createProductionCard;
createProductionCard = function(production) {
    const card = originalCreateProductionCard(production);
    const footer = card.querySelector(".card-footer");
    
    const editButton = document.createElement("button");
    editButton.className = "btn btn-secondary btn-sm ms-2";
    editButton.innerHTML = `<i class="fas fa-edit"></i> Editar`;
    editButton.onclick = () => showEditProductionModal(production.ID_PRODUCAO);
    
    footer.appendChild(editButton);
    return card;
};

