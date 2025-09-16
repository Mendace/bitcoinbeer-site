/**
 * alternativeService.js
 *
 * Questo modulo fornisce le funzioni per recuperare e cercare le alternative
 * tramite le API.
 */

/**
 * Recupera tutte le alternative dall'API.
 * L'API dovrebbe restituire un array di oggetti con campi come:
 * [ { id, categoria, nome, descrizione_it, descrizione_en, paese, url, ... }, ... ]
 */
export async function fetchAllAlternatives() {
  try {
    const response = await fetch('https://api.bitcoinbeer.events/api/alternative_api.php');
    if (!response.ok) {
      throw new Error('Errore nella risposta dell’API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore fetchAllAlternatives:', error);
    return [];
  }
}

/**
 * Cerca le alternative che corrispondono alla query.
 *
 * Se l'API supporta una ricerca lato server tramite un parametro GET (ad esempio, "search"),
 * puoi decommentare la parte corrispondente e usarla al posto del filtro locale.
 *
 * In alternativa, viene effettuato un filtro in locale sull'array restituito da fetchAllAlternatives,
 * confrontando la query con i campi "nome", "categoria", "descrizione_it" e "descrizione_en".
 */
export async function searchAlternatives(query) {
  try {
    // --- Opzione 1: ricerca lato server ---
    // const response = await fetch(`https://api.bitcoinbeer.events/api/alternative_api.php?search=${encodeURIComponent(query)}`);
    // if (!response.ok) {
    //   throw new Error('Errore nella risposta dell’API per la ricerca');
    // }
    // const data = await response.json();
    // return data;

    // --- Opzione 2: filtro locale ---
    const alternatives = await fetchAllAlternatives();
    const lowerQuery = query.toLowerCase();
    return alternatives.filter(item =>
      (item.nome && item.nome.toLowerCase().includes(lowerQuery)) ||
      (item.categoria && item.categoria.toLowerCase().includes(lowerQuery)) ||
      (item.descrizione_it && item.descrizione_it.toLowerCase().includes(lowerQuery)) ||
      (item.descrizione_en && item.descrizione_en.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Errore searchAlternatives:', error);
    return [];
  }
}
