// cada item na lista de pokémon tem o formato dado por este template.
// como ele é uma função (seta), para usá-lo, você deve:
//
// import { listItemTemplate } from './templates.js';
// ...
// const dados = PEGAR DADOS DE UM POKEMON
// const pokemonNaLista = listItemTemplate(dados);
//
export const listItemTemplate = data => 
`   <li class="list-item" data-id="${data.number}">
        <span class="list-meta-info">
            <img src="${data.imageUrl}" class="item-avatar-img" alt="${data.name}">
            <span class="number">${String(data.number).padStart(3, '0')}</span>
        </span>
        <span class="list-info">
            <span class="name">${data.name}</span>
        </span>
    </li>`;

    
// formato de um tipo de pokémon (grama, água, fogo etc.). Para usar:
// import { typeTemplate } from './templates.js'
// ...
// const tipoDoPokemon = typeTemplate('grama');
//
export const seasonTemplate = name => `<span class="season">${name}</span>`
