# [译]html5中应用canvas进行浏览器指纹识别


## 摘要
将浏览器与操作系统功能和系统硬件更紧密地结合意味着网站可以更多地访问这些资源，并且浏览器行为会根据这些资源的行为而变化。

我们提出了一个新的系统指纹，灵感来自以上观察：将文本和WebGL场景渲染到`<canvas>`元素，然后检查生成的像素。新的指纹是一致的，高熵的，与其他指纹正交，对用户透明，并且容易获取。
<details>
  <summary>原文</summary>
Tying the browser more closely to operating system functionality and system hardware means that websites have more access to these resources, and that browser behavior varies depending on the behavior of these resources.
  
We propose a new system fingerprint, inspired by the observation above: render text and WebGL scenes to a < canvas > element, then examine the pixels produced. The new fingerprint is consistent, high-entropy, orthogonal to other fingerprints, transparent to the user, and readily obtainable.
</details>

## 1.介绍
浏览器正变得越来越复杂，成为了功能更加丰富的应用程序平台，承担了传统操作系统提供的更多功能。这种增加的复杂性很大程度上是由 HTML5 规范套件推动的，其中包括对程序化绘图表面（`<canvas>`）、三维图形（`WebGL`）、结构化客户端数据存储、地理位置服务、操纵浏览器历史和浏览器缓存、音频和视频播放等功能的支持。
<details>
  <summary>原文</summary>
Browsers are becoming increasingly sophisticated application platforms, taking on more of the functionality traditionally provided by an operating system. Much of this increasing sophistication is driven by the HTML5 suite of specifications, which make provisions for a programmatic drawing surface (< canvas >), three-dimensional graphics (WebGL), a structured client-side datastore, geolocation services, the ability to manipulate browser history and the browser cache, audio and video playback, and more.
</details>

浏览器实现这些功能的自然方式是利用主机操作系统和硬件。使用 GPU 进行 3D 图形（甚至 2D 图形合成<sup>1</sup>）可以显著提高性能，同时节省移动设备的电池。而使用操作系统的字体渲染代码来显示文本意味着浏览器会自动以符合显示效果并符合用户期望的方式显示文本。<sup>2</sup>
<details>
  <summary>原文</summary>
The natural way for browsers to implement such features is to draw on the host operating system and hardware. Using the GPU for 3D graphics (and even for 2D graphics compositing<sup>1</sup>) provides substantial performance improvements, as well as battery savings on mobile devices. And using the operating system’s font-rendering code for text means that browsers automatically display text in a way that is optimized for the display and consistent with the user’s expectations.<sup>2</sup>
</details>

<details>
<summary>原文</summary>
This paper proceeds from the following simple observation: Tying the browser more closely to operating system functionality and system hardware means that websites have more access to these resources, and that browser behavior varies depending on the behavior of these resources. The first part of this observation has security implications: codebases not designed to handle adversarial input can now be exposed to it.<sup>3</sup> The second part of the observation, which we focus on, has privacy implications: different behavior can be used to distinguish systems, and thereby fingerprint the people using them.
</details>

<details>
<summary>原文</summary>
Our results.

We exhibit a new system fingerprint based on browser font and WebGL rendering. To obtain this fingerprint, a website renders text and WebGL scenes to a `<canvas>` element, then examines the pixels produced. Different systems produce different output, and therefore different fingerprints. Even very simple tests— such as rendering a single sentence in a widely distributed system font— produce surprising variation. The new fingerprint has several desirable properties:

<ul>
<li>It is consistent. In our experiments, we obtain pixel-identical results in independent trials from the same user.</li>
<li>It is high-entropy. In 294 experiments on Amazon’s
Mechanical Turk, we observed 116 unique fingerprint
values, for a sample entropy of 5.73 bits. This is so
even though the user population in our experiments
exhibits little variation in browser and OS.</li>
<li>It is orthogonal to other fingerprints. Our fingerprint
measures graphics driver and GPU model, which is independent of other possible fingerprints discussed below.</li>
<li>It is transparent to the user. Our tests can be performed, offscreen, in a fraction of a second. There is
no indication, visual or otherwise, that the user’s system is being fingerprinted.
</li>
<li>It is readily obtainable. Any website that runs JavaScript on the user’s browser can fingerprint its rendering behavior; no access is needed besides what is
provided by the usual web attacker model.</li>
</ul>
</details>

<details>
<summary>原文</summary>
Our fingerprint can be used as a black box or as a white
box. A website could render tests to a `<canvas>`, extract the
resulting pixmap, then use a cryptographic hash to obtain
a short, convenient fingerprint. Because the fingerprint is
consistent, the pixmap (and therefore its hash) will be identical in multiple runs on one machine, but take on different
values depending on hardware and software configuration.
This is a black-box use of the fingerprint, since it extracts to attackers by the WebFont specification, was patched to fix
an exploitable parsing vulnerability as recently as December
of last year [13, 4].

</details>

> [Pixel Perfect: Fingerprinting Canvas in HTML5](https://hovav.net/ucsd/dist/canvas.pdf)
