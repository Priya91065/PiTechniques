//   document.addEventListener("DOMContentLoaded", function() {
//       const button = document.getElementById("toggle-jobs");
//       if (!button) return; // if jobs <= 4, no button

//       const allJobs = document.querySelectorAll(".job-item");
//       let expanded = false;

//       button.addEventListener("click", function() {
//           if (!expanded) {
//               // Show all jobs
//               allJobs.forEach(job => job.style.display = "flex");
//               button.textContent = "View Less";
//               expanded = true;
//           } else {
//               // Hide jobs after the first 4
//               allJobs.forEach((job, index) => {
//                   job.style.display = (index < 4) ? "flex" : "none";
//               });
//               button.textContent = "View More";
//               expanded = false;

//               // Optional: scroll back to top of job list

//           }
//       });
//   });


// document.addEventListener("DOMContentLoaded", function() {
//     const button = document.getElementById("toggle-jobs");
//     if (!button) return;

//     const allJobs = document.querySelectorAll(".job-item");
//     const btnText = button.querySelector(".btn-text");
//     const arrowImg = button.querySelector(".toggleArrow");

//     const imgMore = button.dataset.more;
//     const imgLess = button.dataset.less;

//     let expanded = false;

//     button.addEventListener("click", function() {
//         if (!expanded) {
//             allJobs.forEach(job => job.style.display = "flex");
//             btnText.textContent = "View Less";
//             arrowImg.src = imgLess;
//             expanded = true;
//             button.classList.add("upArrowAniamtion");
//         } else {
//             allJobs.forEach((job, index) => {
//                 job.style.display = (index < 4) ? "flex" : "none";
//             });
//             btnText.textContent = "View More";
//             button.classList.remove("downArrowAniamtion");
//             arrowImg.src = imgMore;
//             expanded = false;
//         }
//     });
// });



document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("toggle-jobs");
    if (!button) return;

    const allJobs = document.querySelectorAll(".job-item");
    const btnText = button.querySelector(".btn-text");
    const arrowImg = button.querySelector(".toggleArrow");

    const imgMore = button.dataset.more; // down arrow
    const imgLess = button.dataset.less; // up arrow

    let expanded = false;

    button.addEventListener("click", function() {
        if (!expanded) {
            // Show all jobs
            allJobs.forEach(job => job.style.display = "flex");
            btnText.textContent = "View Less";
            arrowImg.src = imgLess;

            // toggle animation class
            button.classList.remove("downArrowAniamtion");
            button.classList.add("upArrowAniamtion");

            expanded = true;
        } else {
            // Hide jobs after the first 4
            allJobs.forEach((job, index) => {
                job.style.display = (index < 4) ? "flex" : "none";
            });
            btnText.textContent = "View More";
            arrowImg.src = imgMore;

            // toggle animation class
            button.classList.remove("upArrowAniamtion");
            button.classList.add("downArrowAniamtion");

            expanded = false;
        }
    });
});