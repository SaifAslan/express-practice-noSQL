const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const productElement = btn.closest("article");
  fetch("/admin/product/" + productId, {
    method: "DELETE",
    // headers:{}
  })
    .then((res) => {
      productElement.parentNode.removeChild(productElement);
      return res.json();
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};
