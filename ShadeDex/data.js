const cache = {};

// funciona igual ao fetch (inclusive usa ele), mas armazena a resposta
// em cache para evitar ficar fazendo as mesmas requisições para a API
// (e não sobrecarregá-la)
//
export async function friendlyFetch(url) {
    // procura em cache, antes de fazer a requisição
    let cached = localStorage.getItem(url) || cache[url];

    // se não está em cache, faz requisição com fetch
    if (!cached) {
        cached = await fetch(url).then(r => r.json());

        // a. tenta armazenar no localStorage (mas ele é pequeno, ~5MB)
        try {
            localStorage.setItem(url, JSON.stringify(cached));
        } catch (error) {
            // b. não deu pra gravar no localStorage...
            // provavelmente excedeu a quota
            // bora salvar em memória apenas (vai embora qdo atualizar a página)
            cache[url] = cached;
        }

    } else {
        // ela estava em cache (já foi feita antes)... então recuperamos a resposta
        cached = JSON.parse(cached);
    }
    
    return cached;
}