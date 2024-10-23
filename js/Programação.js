// Carregar os pacotes do Google Charts
google.charts.load('current', {
    'packages': ['geochart', 'corechart'],
});

// Definir a função que será chamada ao carregar o mapa
google.charts.setOnLoadCallback(desenharMapa);

// Função para desenhar o mapa
function desenharMapa() {
    fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
        .then(response => response.json())
        .then(data => {
            const chartData = [['Países', 'Casos Confirmados']];
            data.data.forEach(country => {
                chartData.push([country.country, country.confirmed]);
            });

            const dataTable = google.visualization.arrayToDataTable(chartData);

            const options = {
                title: 'Casos Confirmados de COVID-19 por País',
                colorAxis: { colors: ['#90d9ff', '#ab00ff'] }, // Gradiente de cores
                backgroundColor: '#f4f4f4'
            };

            const chart = new google.visualization.GeoChart(document.getElementById('grafico-mapa'));
            chart.draw(dataTable, options);
        })
        .catch(error => {
            document.getElementById('div-erro').innerText = 'Erro ao carregar os dados: ' + error.message;
        });
}

// Carregar o pacote do Google Charts para gráficos de pizza
google.charts.setOnLoadCallback(desenharGraficoPizza);

// Função para desenhar o gráfico de pizza
function desenharGraficoPizza() {
    const data = google.visualization.arrayToDataTable(carregarDadosPizza());
    const options = {
        title: 'Distribuição de Casos de COVID-19',
        is3D: true,
    };

    const chart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));
    chart.draw(data, options);
}

// Função para carregar os dados do gráfico de pizza
function carregarDadosPizza() {
    return [
        ['Categoria', 'Quantidade'],
        ['Mortes', 15105043],
        ['Confirmados', 103804263],
        ['Curados', 89699220],
    ];
}

// Função para carregar dados da tabela de estados
function carregarTabelaEstados() {
    fetch('https://covid19-brazil-api.now.sh/api/report/v1')
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById('tabela-estados').getElementsByTagName('tbody')[0];

            // Limpar a tabela antes de preencher
            tabela.innerHTML = '';

            // Adicionar os dados da API na tabela
            data.data.forEach(estado => {
                const novaLinha = tabela.insertRow();

                const estadoCell = novaLinha.insertCell(0);
                const casosCell = novaLinha.insertCell(1);
                const mortesCell = novaLinha.insertCell(2);
                const suspeitosCell = novaLinha.insertCell(3);
                const descartadosCell = novaLinha.insertCell(4);

                estadoCell.innerHTML = estado.state;
                casosCell.innerHTML = estado.cases.toLocaleString('pt-BR');
                mortesCell.innerHTML = estado.deaths.toLocaleString('pt-BR');
                suspeitosCell.innerHTML = estado.suspects.toLocaleString('pt-BR');
                descartadosCell.innerHTML = estado.refuses.toLocaleString('pt-BR');
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados dos estados:', error);
        });
}
carregarTabelaEstados();
