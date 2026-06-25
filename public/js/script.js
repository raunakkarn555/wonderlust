(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

    const btn = document.getElementById("load-more-btn");
    const loadMoreContainer = document.getElementById("listings-container");

    if(btn) {
        btn.addEventListener("click", async () => {
            const loaded = Number(loadMoreContainer);
            const total = Number(loadMoreContainer);
            const category = loadMoreContainer;

            btn.innerText = "Loading...";
            btn.disabled = true;

            // build the API URL
            let url = `/listings/load-more?skip=${loaded}`;
            if(category) url += `&category=${encodeURIComponent(category)}`;

            const response = await fetch(url);
            const data = await response.json();

            // build and append new cards
            data.listings.forEach(listing => {
                const col = document.createElement("a");
                col.href = `/listings/${listing._id}`;
                col.classList.add("listing-link");
                col.innerHTML = `
                    <div class="listing-card col card">
                        <img src="${listing.image.url}" class="card-img-top" alt="listing_image" style="height: 20rem;">
                        <div class="card-img-overlay"></div>
                        <div class="card-body">
                            <p class="card-text">
                                <b>${listing.title}</b><br>
                                &#8377; ${listing.price.toLocaleString("en-IN")} / night
                            </p>
                        </div>
                    </div>
                `;
                loadMoreContainer(col);
            });

            // update loaded count
            const newLoaded = loaded + data.listings.length;
            container.dataset.loaded = newLoaded;

            // hide button if all loaded
            if(newLoaded >= data.totalListings) {
                document.getElementById("load-more-container").style.display = "none";
            } else {
                btn.innerText = "Load More";
                btn.disabled = false;
            }
        });
    }