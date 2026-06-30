const mealInput = document.getElementById("mealInput");
const searchButton = document.getElementById("searchMeal");

const popup = document.getElementById("popupReceita");
const toast = document.getElementById("toast");

let carrinho = [];

const contadorCarrinho = document.getElementById("contadorCarrinho");
const popupCarrinho = document.getElementById("popupCarrinho");
const listaCarrinho = document.getElementById("listaCarrinho");

function mostrarToast(mensagem) {
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function atualizarCarrinho() {
  contadorCarrinho.textContent = carrinho.length;
  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  carrinho.forEach((meal, index) => {
    const item = document.createElement("div");
    item.className = "itemCarrinho";

    item.innerHTML = `
      <span>${meal.strMeal}</span>
      <button>Remover</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      carrinho.splice(index, 1);
      atualizarCarrinho();
    });

    listaCarrinho.appendChild(item);
  });
}

searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  const mealName = mealInput.value.trim();

  if (mealName.length < 3) {
    alert("Digite pelo menos 3 letras.");
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
    true
  );

  xhr.onload = function () {
    if (xhr.status !== 200) {
      alert("Erro ao consultar a API.");
      return;
    }

    const data = JSON.parse(xhr.responseText);

    if (!data.meals) {
      alert("Receita não encontrada.");
      return;
    }

    const popupConteudo = popup.querySelector(".popup-conteudo");

    popupConteudo.innerHTML = `
      <span class="fechar">&times;</span>
      <h2>Escolha sua refeição</h2>
      <div id="mealsContainer" class="meals-container"></div>
    `;

    const mealsContainer = document.getElementById("mealsContainer");

    data.meals.forEach((meal) => {
      const card = document.createElement("div");
      card.className = "meal-card";

      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-card-image">
        <h3>${meal.strMeal}</h3>
        <button class="meal-card-button">Fazer Pedido</button>
      `;

      card.querySelector(".meal-card-button").addEventListener("click", () => {
        carrinho.push(meal);
        atualizarCarrinho();
        mostrarToast(`${meal.strMeal} adicionado ao carrinho!`);
      });

      mealsContainer.appendChild(card);
    });

    popup.style.display = "flex";

    popup.querySelector(".fechar").addEventListener("click", () => {
      popup.style.display = "none";
    });
  };

  xhr.onerror = () => alert("Erro de conexão.");

  xhr.send();
});

popup.addEventListener("click", (event) => {
  if (event.target === popup) popup.style.display = "none";
});

mealInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});

document.querySelector(".carrinho").addEventListener("click", () => {
  atualizarCarrinho();
  popupCarrinho.style.display = "flex";
});

document.getElementById("fecharCarrinho").addEventListener("click", () => {
  popupCarrinho.style.display = "none";
});

document.getElementById("finalizarPedido").addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  mostrarToast("Pedido realizado com sucesso!");

  carrinho = [];
  atualizarCarrinho();
  popupCarrinho.style.display = "none";
});
