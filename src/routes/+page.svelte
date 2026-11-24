<script>
	import Header from "$lib/components/Header.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
  import PrimaryWindow from "$lib/components/PrimaryWindow.svelte";
</script>

<svelte:head>
  <title>leftist.cafe | Home</title>
</svelte:head>

<div class="flex min-h-dvh items-center justify-center px-4 py-4">
  <PrimaryWindow title="Lily's Website">
    <Navbar />
    <div class="mx-auto max-w-[90%] text-justify">
      <Header size={3}>Hi, I'm Lily (she/her)</Header>
      I have a lot of hobbies and interests.
      This website mainly covers my software, music, and political science works.
      The <b>Blog</b> and <b>Projects</b> sections of this site are currently under construction.

      <br/><br/>
      <Header size={4}>Music</Header>
      I've been making music since around 2016, with varying styles, genres, and artist names throughout.
      As of writing (November, 2026), my focus is on indie electronic, grunge, and experimental rock.
      Most of my music has not been posted publicly since I have a hard time considering my projects to be complete.
      <br/><br/>
      My music is available in the following places:
      <br/><br/>
      <fieldset>
        <div class="inline">
          ♫ <a href="https://www.youtube.com/@luxzi">YouTube — l1ly</a>
        </div>
        <div class="inline">
          ♫ <a href="https://soundcloud.com/z0mgirl">Soundcloud — zombgirl</a>
        </div>
      </fieldset>

      <Header size={4}>Software</Header>
      I mostly contribute to existing software instead of writing my own.
      My primary experience is in systems languages like C, C++, and Rust.
      With some experience in web technologies and higher level languages such as Go.
      <br/><br/>
      Places where you can find my software and contributions:
      <br/><br/>
      <fieldset>
        <div class="inline">⤷ <a href="https://github.com/lilyvex">GitHub</a></div>
        <div class="inline">⤷ <a href="https://codeberg.org/lilyvex">Codeberg</a></div>
      </fieldset>

      <Header size={4}>Political Science</Header>
      I'm sure you can already tell from the domain of this website that I have an interest in political activism.
      I primarily study Marxism and Leninism, often called Marxism-Leninism.
      Once the Blog section of this site is complete, I will post Marxist analyses of current events, historical events, and original works.
      Trans rights are human rights.
    </div>

    <div class="max-w-[80%] mx-auto mt-2">
      <div role="tooltip" class="is-top is-right">Contact Webmaster: <a href="mailto:luxzi@pm.me">luxzi@pm.me</a></div>
    </div>
  </PrimaryWindow>
</div>