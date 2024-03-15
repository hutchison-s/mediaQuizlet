export default function success(url) {
    return `
    <aside id="sidebar">
      <h1><i class="fa-solid fa-circle-play"></i>Audio&nbsp;Quizlet</h1>
      <button id="createAnother" class="softCorner">Create another Quiz</button>
    </aside>
    <section id="root">
      <div class="softCorner shadow" id="successBox">
        <h2>Quizlet Successfully Created</h2>
        <a href=${url}>${url}</a>
      </div>
    </section>
    `
}