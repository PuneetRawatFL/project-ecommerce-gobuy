//adding event listener
incBtn.addEventListener("click", () => {
    index++;
    count.innerText = index + 1;
    console.log(count.innerText);
});
