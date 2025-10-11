document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu");
  const nav = document.querySelector("nav");
  const gallery = document.querySelector('.gallery');
  let modal; // Will hold the <dialog> element


  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Since the provided CSS handles menu visibility using media queries,
  // we do not need the resize event handler described in the instructions' Step 02
  // (which used a '.hide' class that isn't present in the current CSS).
  // The 'display: none' on 'nav' and 'display: block' on 'nav.open' and
  // the media query for large screens correctly handle the responsive menu.


  // --- Step 04: Image Viewer Functions ---

  /**
   * Generates and shows the modal viewer.
   * @param {string} imgSrc - The source for the full-size image.
   * @param {string} imgAlt - The alt text for the image.
   */
  function viewerTemplate(imgSrc, imgAlt) {
    // Construct the HTML for the dialog content
    const content = `
      <div class="viewer-content">
        <img src="${imgSrc}" alt="${imgAlt}">
        <button class='close-viewer'>X</button>
      </div>
    `;

    // Create the <dialog> element
    modal = document.createElement('dialog');
    modal.innerHTML = content;
    document.body.appendChild(modal);

    // Add event listener to close button
    const closeButton = modal.querySelector('.close-viewer');
    closeButton.addEventListener('click', () => {
      modal.close();
    });

    // Add event listener to close when clicking outside the viewer content
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });

    // Show the modal
    modal.showModal();

    // Clean up the modal from the DOM after it closes (to allow fresh creation next time)
    modal.addEventListener('close', () => {
        modal.remove();
    }, { once: true });
  }

  /**
   * Handles click events on the gallery section.
   * @param {Event} event - The click event object.
   */
  function galleryHandler(event) {
    // Find the closest <img> element that was clicked
    const clickedImage = event.target.closest('img');

    if (clickedImage) {
      const smallSrc = clickedImage.getAttribute('src');
      const altText = clickedImage.getAttribute('alt');

      // 1. Get the base file name (e.g., 'norris') from 'norris-sm.jpeg'
      //    The split('-') creates an array: ['norris', 'sm.jpeg']
      // Ensure the filename transformation matches your actual file naming convention
      const newSrc = smallSrc.replace('norris-sm.jpeg', 'norris-sm.jpeg');

      // 2. Call the function to create and show the viewer
      viewerTemplate(newSrc, altText);
    }
  }

  // Add the event listener to the entire gallery section
  gallery.addEventListener('click', galleryHandler);

});