# Contributing to Idealista

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to Idealista's repositories, which are hosted in the [Idealista Organization](https://github.com/idealista) on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Pull Requests](#pull-requests)
  * [Changelog](#changelog)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by the [Idealista Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [labs@idealista.com](mailto:labs@idealista.com).


## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Idealista. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template](ISSUE_TEMPLATE.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* **Check the last version.** Check if you can reproduce the problem in the latest version of the project.
* **Check the FAQ of the project** for a list of common questions and problems.
* **Perform a [cursory search](https://github.com/issues?q=+is%3Aissue+user%3Aidealista)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue on the project repository and provide the following information by filling in [the template](ISSUE_TEMPLATE.md).

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Idealista, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill in [the template](ISSUE_TEMPLATE.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

* **Check the last version.** Check if you can reproduce the problem in the latest version of the project.
* **Check the FAQ of the project** for a list of common questions and problems.
* **Perform a [cursory search](https://github.com/issues?q=+is%3Aissue+user%3Aidealista)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue on the project repository and provide the following information by filling in [the template](ISSUE_TEMPLATE.md):

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful**.
* **List some other text editors or applications where this enhancement exists.**
* **Specify which version are you're using.**

### Pull Requests

* Fill in [the required template](PULL_REQUEST_TEMPLATE.md)
* Any pull request should has **idealista:develop** as base branch.

### Changelog

Every project has a CHANGELOG.md file. Once your code is ready to be merged please fill the issue after the **Unreleased** section as explained:

* For an enhancement, fill the issue after the **Added** subsection (create it if doesn't exists)
* For a fixed bug, fill the issue after the **Fixed** subsection (create it if doesn't exists)
* For an improvement, fill the issue after the **Changed** subsection (create it if doesn't exists)

Then write the issue info this way:

- *[#29](https://github.com/idealista/nginx-role/issues/29) Support debian stretch* @jmonterrubio

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
