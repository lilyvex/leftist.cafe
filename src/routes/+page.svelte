<script>
  import TerminalWindow from '$lib/components/TerminalWindow.svelte';
</script>

<div class="flex items-center justify-center min-h-screen">
    <TerminalWindow title="User: Lily">
        <h2>Lily's Website</h2>
        <p class="text-justify">
            Hi, I'm Lily (she/her). I'm a computer scientist, and I contribute to open-source projects in my freetime. 
            You can find my work on <a href="https://github.com/lilyvex">GitHub</a> and <a href="https://codeberg.org/lilyvex">Codeberg</a>. 
            I do a little bit of everything. My primary experience is in systems languages such as C, C++, and Rust.
            With additional experience in web technologies and scripting languages.
        </p>
        <h3>Contact</h3>
        <ul class="pb-3">
            <li><a href="mailto:luxzi@pm.me">E-mail</a></li>
        </ul>
        <hr/>
        <div class="flex items-center justify-center pt-4 pb-2">
            <img src="https://cyber.dabamos.de/88x31/linux-p.gif" style="image-rendering: pixelated;" alt="Linux Powered"/>
            <img src="https://88x31.nl/gifs/transnow2.gif" style="image-rendering: pixelated;" alt="Trans Rights Now"/>
        </div>
    </TerminalWindow>
</div>