const formData = {
    "collection-name": "",
    "description": "",
    "keywords": "",
    "contents": {},
    "duration": "",
    "premium": ""
  };

  document.getElementById('add-material-btn').addEventListener('click', function() {
    const materialsContainer = document.getElementById('materials-container');
    const materialInput = document.createElement('div');
    materialInput.classList.add('material-input');
    materialInput.innerHTML = `
      <input type="text" placeholder="Title">
      <input type="text" placeholder="Link">
      <button class="remove-material-btn">Remove</button>
    `;
    materialsContainer.appendChild(materialInput);
    bindRemoveMaterialButton(materialInput);
    updateFormData();
  });

  function bindRemoveMaterialButton(materialInput) {
    materialInput.querySelector('.remove-material-btn').addEventListener('click', function() {
      materialInput.remove();
      updateFormData();
    });
  }

  function updateFormData() {
    const materials = {};
    document.querySelectorAll('.material-input').forEach((materialInput, index) => {
      const title = materialInput.querySelector('input[type="text"]:nth-child(1)').value;
      const link = materialInput.querySelector('input[type="text"]:nth-child(2)').value;
      materials[`${index + 1}`] = { title, link };
    });
    formData.content = materials;
    console.log(formData);
  }
  
  document.querySelectorAll('.form-group textarea, #collection-name, #duration, .form-group input[type="radio"]').forEach(input => {
    input.addEventListener('input', function() {
        formData[this.name] = this.value;
        console.log(formData);
    });
});

function saveCollection(){
    updateFormData()
    console.log(formData);

    fetch('http://127.0.0.1:5000/collections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            alert("collection Saved SuccessFully")
        })
        .catch(error => {
            console.error('Error excecution', error);
        });
}

