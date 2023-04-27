<h1 align="center">
  Notation
</h1>

<div align="center">
  <a href="https://github.com/numanzamandipuu/Notation/issues/new?assignees=&labels=bug&template=01_BUG_REPORT.md&title=bug%3A+">Report a Bug</a>
  ·
  <a href="https://github.com/numanzamandipuu/Notation/issues/new?assignees=&labels=enhancement&template=02_FEATURE_REQUEST.md&title=feat%3A+">Request a Feature</a>
  ·
  <a href="https://github.com/numanzamandipuu/Notation/discussions">Ask a Question</a>
</div>


<div align="center">
  <br>

  [![license](https://img.shields.io/badge/License-%20Apache--2.0-%230018cf)](LICENSE)
  [![Pull Request](https://img.shields.io/badge/Pull%20Requests-Welcome-%2300910c)](https://github.com/numanzamandipuu/Notation/pulls)
  [![Issues](https://img.shields.io/badge/Issues-Welcome-%23570091)](https://github.com/numanzamandipuu/Notation/issues)
  [![Made With Love](https://img.shields.io/badge/Made%20With-Love-%23ff003c)](https://github.com/numanzamandipuu/)

</div>

![Repository Banner](https://user-images.githubusercontent.com/72611571/233857358-53d9dc13-0b11-4685-99a4-9a41afd2b9ea.png)

<br>

### Notation is a Chromium-Based Browser Extension that uses a special algorithm to highlight the first syllable of a word, allowing readers to focus on the highlighted parts and read up to 1.75x faster. With customizable font-weight and opacity, Notation enhances the reading experience on any website.

<br>
<br>


<details open="open">

  <summary>
    <h1>Table of Contents</h1>
  </summary>

  - [Installation](#installation)
  - [Features](#features)
  - [System Architecture](#system-architecture)
  - [Contributing](#contributing)
    - [Clone Repository](#clone-repository)
      - [HTTPS](#https)
      - [SSH](#ssh)
      - [GitHub CLI](#github-cli)
      - [GitHub Desktop](#github-desktop)
  - [Code of Conduct](#code-of-conduct)
  - [Support](#support)
  - [License](#license)

</details>


# Installation

1.  First, go to this [Release Page](https://github.com/numanzamandipuu/Notation/releases/tag/v1.0.2) of the Notation repository and download the [Source Code(zip)](https://github.com/numanzamandipuu/Notation/archive/refs/tags/v1.0.2.zip) file from the bottom of that page.
2.  After downloading, unzip the file, and you should see a folder named `Notation-1.0.2`.
3.  Open your Chrome or Edge web browser, and go to the following link:
    -   **For Chrome:** [chrome://extensions/](chrome://extensions/)
    -   **For Edge:** [edge://extensions/](edge://extensions/)
4.  On the page, make sure to enable `Developer Mode`.
    -   **For Chrome:** It is located on the top-right corner of the page.
    -   **For Edge:** It is located on the bottom-left corner of the page.
5.  Now, you'll find a button called `Load Unpacked Extension`. Click on that.
6.  Select the `Notation-1.0.2` folder you unzipped earlier and click `Select Folder`.

Congratulations! Notation is now installed and ready to use. Make sure to pin the Extension for a better experience!


# Features

To make this Extension more user-friendly and accessible, the following features have been included:

 -  [**Easy Installation:**](#installation) Installation is a breeze with Notation. Our [well-documented guide](#installation) ensures you'll be up and running in no time.

 -  [**Stunning UI:**](https://github.com/numanzamandipuu/Notation/tree/main/src/popup) Notation features a visually impressive User Interface that is easy to navigate and a pleasure to use.

 -  [**Comprehensive Documentation:**](https://github.com/numanzamandipuu/Notation#readme) Our Extension has a detailed `README` file that provides all the necessary information and instructions. Our documentation is an informative guide to help you get the most out of Notation. 

 -  [**Stellar Support:**](https://github.com/numanzamandipuu/Notation/issues) We are committed to providing exceptional support to our users. If you encounter any problems, drop an [Issue here](https://github.com/numanzamandipuu/Notation/issues), and we will work quickly to resolve them to ensure your experience with Notation is as smooth as possible.

 -  [**Contributions Welcome:**](https://github.com/numanzamandipuu/Notation/pulls)  The repository is open to contributions from the community. Users can contribute their solutions or even suggest improvements to existing ones.

 -  [**License:**](LICENSE) This repository follows the `Apache-2.0 license`. Users can use and modify the code for personal and commercial purposes if they give appropriate credit and maintain the license terms.

Overall, the purpose of this Extension is to enhance the reading experience of users and, in the meantime, to provide a centralized location for users and developers to access and contribute to the codebase.



# System Architecture

 - **One Click Activation:** The Extension has a main trigger button that activates the core functionality. I implemented this feature through an event listener that waits for the user to click the button, which triggers the `applyButton` to start the `notation()` Function.
 - **Auto Apply Feature:** To streamline the user experience, the Extension includes an `autoButton` functionality. It automatically applies the custom font weight and opacity values to every website the user visits. This feature is implemented through a similar event listener but with different trigger conditions.
 - **Customizable Font Weight & Opacity:** The range sliders for font weight and opacity allow the user to customize the visual appearance of the converted text. These sliders rely on JavaScript code that dynamically updates the CSS properties of the relevant elements.
 - **Easy to Restore:** The restore default button provides a simple way for the user to revert to the original font weight and opacity values. This functionality works by resetting the range slider values to their default positions, which in turn updates the CSS properties of the elements.



# Contributing

We welcome contributions to Notation! If you're interested in contributing, follow these steps:

## Clone Repository

To use this repository, clone it to your local machine using one of the following commands:

### HTTPS
Use Git or checkout with SVN using the web URL.

```
https://github.com/numanzamandipuu/Notation.git
```

### SSH
Use a password-protected SSH key.

```
git@github.com:numanzamandipuu/Notation.git
```

### GitHub CLI
Work fast with GitHub's official CLI. 

```
gh repo clone numanzamandipuu/Notation
```

### GitHub Desktop
Open with GitHub Desktop Application.

```
x-github-client://openRepo/https://github.com/numanzamandipuu/Notation
```

When you finish the cloning procedure, you can start contributing in several ways:

- **Report Issues:** If you encounter a bug or have an idea for improvement, you can report it on the project's [GitHub Issues](https://github.com/numanzamandipuu/Notation/issues) page.

- **Submit Pull Requests:** If you are interested in contributing code to the project, you can fork the repository, make changes to your forked copy, and then submit a [Pull Request](https://github.com/numanzamandipuu/Notation/pulls) to merge your changes back into the main codebase.

- **Help With Documentation:** You can help with documentation. The docs can include writing tutorials, updating the project's `README` file, or adding comments to the code to make it clearer and more understandable.


# Code of Conduct

Notation follows a Code of Conduct that promotes a safe, inclusive, and respectful environment for all contributors and users. By contributing to this repository, you agree to abide by and uphold its principles.


# Support

Notation is committed to providing excellent support to its users. If you encounter any issues or have questions about the Extension, I encourage you to ask for assistance. You can connect with me on [LinkedIn](https://www.linkedin.com/in/numanzamandipuu/) or email me at [2102115@student.ruet.ac.bd](mailto:2102115@student.ruet.ac.bd).  I will respond ASAP to address your concerns.


# License

Notation, as open-source software, is distributed under the [`Apache-2.0 license`](LICENSE), which grants users the right to use, modify, and distribute the code as they see fit, with the condition that any derivative works must also be distributed under the same license. By choosing to distribute Notation under this license, we aim to encourage collaboration and community contributions while ensuring legal protection for both users and contributors.
