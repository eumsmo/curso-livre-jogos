import { showList, showDetail } from './navigation.js';
import { listItemTemplate, seasonTemplate } from './templates.js';
import { capitalize } from './capitalize.js';
import { friendlyFetch } from './data.js';

// endereço da API: usado para fazer as requisições
const api = 'https://www.nokeynoshade.party/api/';
const urls = {
    queens(id="all") { 
        return api + "queens/"+id;
    },

};
const classes = {
    numero: "number",
    nome: "name",
    lista_item: "list-item",
    lista_meta: "list-meta-info",
    lista_meta_img: "item-avatar-img",
    lista_info: "list-info",
};

// pega todos os elementos HTML que serão necessários
const listEl = document.querySelector('#list');
const detailEl = document.querySelector('#detail-section');
const backEl = document.querySelector('.back-to-list');
const avatarImgEl = document.querySelector('#avatar-img');
const detailAvatarImgEl = detailEl.querySelector('.item-avatar-img');
const detailNumberEl = detailEl.querySelector('.number');
const detailNameEl = detailEl.querySelector('.name');
const detailTitleEl = detailEl.querySelector('#detail-title');
const detailWinsEl = detailEl.querySelector('#detail-wins');
const detailMiniWinsEl = detailEl.querySelector('#detail-mini-wins');
const detailEpsEl = detailEl.querySelector('#detail-eps');
const detailSeasonsEl = detailEl.querySelector('#detail-seasons');

// lista com todos os pokemons
let drags = [];

// SEU CÓDIGO PODE VIR AQUI

// ao fazer requisições Ajax, em vez do fetch(...), opte pela função exportada por data.js
// chamada friendlyFetch(...) - ela faz a requisição igual a fetch, mas armazena a resposta
// em um cache local (para evitar sobrecarregar a API)

// Função que completa os valores da tela de detalhe
function completaDetalhes(detalhes){
    detailAvatarImgEl.src = "imgs/logo.svg";
    detailNumberEl.innerHTML = String(detalhes.id).padStart(3, '0');
    detailNameEl.innerHTML = detalhes.name;
    detailTitleEl.innerHTML = detalhes.quote;

    avatarImgEl.src = detalhes.image_url;


    detailSeasonsEl.innerHTML = "";
    for(let temporada of detalhes.seasons){
        let nome_temporada = temporada.seasonNumber;
        nome_temporada = nome_temporada.startsWith("A")? "Rupaul's All Stars "+nome_temporada.slice(1) : "Rupaul's Drag Race "+nome_temporada;
        detailSeasonsEl.innerHTML += seasonTemplate(nome_temporada);
    }

    let desafios = detalhes.challenges.reduce((prev, atual)=>{
        if(atual.won){
            if(atual.type in prev){
                prev[atual.type]++;
            } else {
                prev[atual.type]=1;
            }
        }

        return prev;
    });

    detailWinsEl.innerHTML = (desafios.main || 0) + " vitórias";
    detailMiniWinsEl.innerHTML = (desafios.mini || 0) + " vitórias";
    detailEpsEl.innerHTML = detalhes.episodes.length + " episódios";

}

// Função chamada quando um item da lista é clicado
function selecionarItem(evt){
    let itemEl = evt.currentTarget,
        id = itemEl.dataset.id;
    
    const selecionados = listEl.querySelectorAll(".selected");
    if(selecionados.length>0){
        selecionados.forEach(el=> el.classList.remove("selected"));
    }

    itemEl.classList.add("selected");
    friendlyFetch(urls.queens(id)).then(completaDetalhes);
    showDetail();
}

// Função que gera a lista de drag queens através de AJAX
async function gerarLista(){
    drags = await friendlyFetch(urls.queens());

    // Remove todo conteudo da lista
    listEl.innerHTML = "";

    // Gera itens da lista
    for (let drag of drags) {
        const item = listItemTemplate({
            number: drag.id,
            imageUrl: "imgs/logo.svg",
            name: drag.name
        });

        listEl.innerHTML += item;
    }

    // Seleciona itens da lista e adiciona evento
    const itens = listEl.querySelectorAll("li");
    for (let item of itens) {
        item.addEventListener("click", selecionarItem);
    }
}

// Gera lista através de AJAX
gerarLista();

// Função de voltar da tela de detalhes
backEl.addEventListener("click", ()=>showList());