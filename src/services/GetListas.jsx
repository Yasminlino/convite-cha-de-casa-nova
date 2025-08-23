const scriptURL = 
"https://script.google.com/macros/s/AKfycbyjv4ghYBYsCg1cRt4lfwNeT_D_Mj60GjC_rgJ1PLe_MAVjUWcNkIIj4cauuO9HQihV-A/exec?action=";

export const getListas = async (lista) => {
    const url = `${scriptURL}${lista}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors"
        });
        const data = await response.json();
        window.localStorage.setItem(lista, JSON.stringify(data));
        console.log("Dados obtidos com sucesso:", data);
        return data;
    }
    catch (error) {
        console.error("Erro ao obter a lista de presentes:", error);
        return [];
    }
}