import React, { Component } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ClearIcon, SaveIcon, CopyIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class GitFolderDownloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputUrl: "",
      outputMessage: "",
      error: null,
      isFetching: false,
      progress: 0,
      githubToken: "",
      gitlabToken: "",
      logs: [], 
    };

    this.debounceTimeout = null;
  }


  addLog = (message) => {
    // const timestamp = new Date().toLocaleTimeString();
    this.setState((prevState) => ({
      // logs: [...prevState.logs, `[${timestamp}] ${message}`],
      logs: [...prevState.logs, `${message}`],
    }));
  };

  handleInputChange = (e) => {
    const inputUrl = e.target.value.trim();
    this.setState({
      inputUrl,
      error: null,
      outputMessage: "",
      progress: 0,
      logs: [], // Clear logs on new input
    });
  };

  clearInput = () => {
    this.setState({
      inputUrl: "",
      outputMessage: "",
      error: null,
      progress: 0,
      logs: [], // Clear logs when input is cleared
    });
  };

  saveOutputAsText = () => {
    const { logs } = this.state;
    const blob = new Blob([logs.join("\n")], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "download_log.txt");
    this.addLog("Logs have been saved as 'download_log.txt'.");
  };

  copyToClipboard = () => {
    const { logs } = this.state;
    const textToCopy = logs.join("\n");
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        this.addLog("Logs have been copied to the clipboard.");
      },
      (err) => {
        this.addLog("Failed to copy logs to the clipboard.");
        console.error("Could not copy text: ", err);
      }
    );
  };

  download = () => {
    const { inputUrl } = this.state;
    if (!inputUrl) {
      this.setState({ error: "Please enter a valid URL." });
      this.addLog("Error: No URL provided.");
      return;
    }

    const parsedUrl = this.parseUrl(inputUrl);
    if (!parsedUrl) {
      this.setState({ error: "Invalid URL format or unsupported platform." });
      this.addLog("Error: Invalid URL format or unsupported platform.");
      return;
    }

    const { platform, type } = parsedUrl;

    switch (platform) {
      case "github":
        this.handleGitHubDownload(parsedUrl);
        break;
      case "gitlab":
        this.handleGitLabDownload(parsedUrl);
        break;
      default:
        this.setState({ error: "Unsupported platform." });
        this.addLog("Error: Unsupported platform.");
    }
  };


  parseUrl = (url) => {
    try {
      // Validate URL
      new URL(url);
    } catch (e) {
      this.addLog(`Invalid URL: ${url}`);
      return null;
    }

    // Remove query parameters and trailing slash if present
    const urlObj = new URL(url);
    const cleanPath = urlObj.origin + urlObj.pathname;
    const cleanUrl = cleanPath.replace(/\/$/, "");

    // Patterns for GitHub
    const githubRepoRegex = /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/i;
    const githubFolderRegex = /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+?)\/tree\/([^\/]+)\/(.+)$/i;
    const githubFileRegex = /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+?)\/blob\/([^\/]+)\/(.+)$/i;

    // Patterns for GitLab
    const gitlabRepoRegex = /^https?:\/\/(www\.)?gitlab\.com\/([^\/]+\/[^\/]+?)(?:\.git)?$/i;
    const gitlabFolderRegex = /^https?:\/\/(www\.)?gitlab\.com\/([^\/]+\/[^\/]+?)\/\-\/tree\/([^\/]+)\/(.+)$/i;
    const gitlabFileRegex = /^https?:\/\/(www\.)?gitlab\.com\/([^\/]+\/[^\/]+?)\/\-\/blob\/([^\/]+)\/(.+)$/i;

    let match;

    // GitHub
    if ((match = cleanUrl.match(githubRepoRegex))) {
      const [, , owner, repo] = match;
      return { platform: "github", type: "repo", owner, repo };
    } else if ((match = cleanUrl.match(githubFolderRegex))) {
      const [, , owner, repo, branch, path] = match;
      return { platform: "github", type: "folder", owner, repo, branch, path };
    } else if ((match = cleanUrl.match(githubFileRegex))) {
      const [, , owner, repo, branch, path] = match;
      return { platform: "github", type: "file", owner, repo, branch, path };
    }
    // GitLab
    else if ((match = cleanUrl.match(gitlabRepoRegex))) {
      const [, , fullName] = match;
      return { platform: "gitlab", type: "repo", fullName };
    } else if ((match = cleanUrl.match(gitlabFolderRegex))) {
      const [, , fullName, branch, path] = match;
      return { platform: "gitlab", type: "folder", fullName, branch, path };
    } else if ((match = cleanUrl.match(gitlabFileRegex))) {
      const [, , fullName, branch, path] = match;
      return { platform: "gitlab", type: "file", fullName, branch, path };
    } else {
      this.addLog(`Unsupported or invalid URL: ${url}`);
      return null;
    }
  };

  handleGitHubDownload = (parsedUrl) => {
    const { type } = parsedUrl;
    switch (type) {
      case "repo":
        this.downloadGitHubRepository(parsedUrl);
        break;
      case "folder":
        this.downloadGitHubFolder(parsedUrl);
        break;
      case "file":
        this.downloadGitHubFile(parsedUrl);
        break;
      default:
        this.setState({ error: "Unsupported GitHub URL type." });
        this.addLog("Error: Unsupported GitHub URL type.");
    }
  };

  handleGitLabDownload = (parsedUrl) => {
    const { type } = parsedUrl;
    switch (type) {
      case "repo":
        this.downloadGitLabRepository(parsedUrl);
        break;
      case "folder":
        this.downloadGitLabFolder(parsedUrl);
        break;
      case "file":
        this.downloadGitLabFile(parsedUrl);
        break;
      default:
        this.setState({ error: "Unsupported GitLab URL type." });
        this.addLog("Error: Unsupported GitLab URL type.");
    }
  };

  downloadGitHubRepository = async ({ owner, repo }) => {
    this.setState({ isFetching: true, error: null, progress: 0, outputMessage: "" });
    this.addLog(`Starting to fetch GitHub repository: ${owner}/${repo}`);

    try {
      // Get repository data to determine the default branch
      this.addLog("Fetching GitHub repository data...");
      const repoData = await this.fetchRepoDataGitHub(owner, repo);
      const defaultBranch = repoData.default_branch;
      this.addLog(`Default branch is '${defaultBranch}'.`);

      // Construct the ZIP download URL
      const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
      this.addLog(`Constructed ZIP URL: ${zipUrl}`);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `${repo}-${defaultBranch}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.addLog("Download initiated via browser.");

      // Update the state to indicate the download has been initiated
      this.setState({
        isFetching: false,
        outputMessage: "GitHub repository fetching process initiated.",
      });
      this.addLog("GitHub repository fetching process completed.");
    } catch (error) {
      console.error("Error fetching GitHub repository:", error);
      this.addLog(`Error: ${error.message}`);
      this.setState({
        error: error.message,
        isFetching: false,
      });
    }
  };

  fetchRepoDataGitHub = async (owner, repo) => {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    this.addLog(`Fetching GitHub repository data from API: ${apiUrl}`);
    const response = await fetch(apiUrl, this.getFetchOptionsGitHub());

    if (response.status === 404) {
      throw new Error("GitHub repository not found. Please check the URL and try again.");
    }

    if (response.status === 403) {
      const rateLimitReset = response.headers.get("X-RateLimit-Reset");
      const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000) : "later";
      throw new Error(`GitHub API rate limit exceeded. Try again after ${resetDate}.`);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub repository data. Status: ${response.status}`);
    }

    this.addLog("GitHub repository data fetched successfully.");
    return await response.json();
  };

  downloadGitHubFolder = async ({ owner, repo, branch, path }) => {
    this.setState({ isFetching: true, error: null, progress: 0, outputMessage: "" });
    this.addLog(`Starting to fetch GitHub folder: ${path} from branch '${branch}'`);

    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
      this.addLog(`Fetching GitHub folder contents from API: ${apiUrl}`);
      const response = await fetch(apiUrl, this.getFetchOptionsGitHub());

      if (response.status === 404) {
        throw new Error("GitHub folder not found. Please check the URL and try again.");
      }

      if (response.status === 403) {
        const rateLimitReset = response.headers.get("X-RateLimit-Reset");
        const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000) : "later";
        throw new Error(`GitHub API rate limit exceeded. Try again after ${resetDate}.`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub folder contents. Status: ${response.status}`);
      }

      const files = await response.json();
      this.addLog(`Fetched ${files.length} items from GitHub folder.`);

      if (!Array.isArray(files)) {
        throw new Error("The specified GitHub path is not a folder.");
      }

      const zip = new JSZip();
      let completed = 0;
      const total = files.length;

      for (const file of files) {
        if (file.type === "file") {
          this.addLog(`Fetching GitHub file: ${file.path}`);
          const fileContent = await this.fetchFileContentGitHub(file.download_url);
          zip.file(file.name, fileContent);
          this.addLog(`Added file to ZIP: ${file.name}`);
        } else if (file.type === "dir") {
          this.addLog(`Entering GitHub subdirectory: ${file.path}`);
          await this.addFolderToZipGitHub(zip.folder(file.name), owner, repo, branch, file.path);
        }

        completed += 1;
        this.setState({ progress: Math.round((completed / total) * 50) }); // 0-50%
        this.addLog(`Progress: ${this.state.progress}%`);
      }

      // Generate ZIP with progress updates
      this.addLog("Generating ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
      });
      this.addLog("ZIP file generated successfully.");

      saveAs(zipBlob, `${path.split("/").pop() || "folder"}.zip`);
      this.addLog("ZIP file download initiated.");

      this.setState({
        isFetching: false,
        outputMessage: "GitHub folder processed successfully!",
        progress: 100,
      });
      this.addLog("GitHub folder fetching process completed.");
    } catch (error) {
      console.error("Error fetching and zipping GitHub folder:", error);
      this.addLog(`Error: ${error.message}`);
      this.setState({
        error: error.message,
        isFetching: false,
      });
    }
  };

  addFolderToZipGitHub = async (zipFolder, owner, repo, branch, path) => {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
      this.addLog(`Fetching GitHub subfolder contents from API: ${apiUrl}`);
      const response = await fetch(apiUrl, this.getFetchOptionsGitHub());

      if (response.status === 404) {
        throw new Error(`GitHub folder not found: ${path}`);
      }

      if (response.status === 403) {
        const rateLimitReset = response.headers.get("X-RateLimit-Reset");
        const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000) : "later";
        throw new Error(`GitHub API rate limit exceeded. Try again after ${resetDate}.`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub folder contents: ${path}. Status: ${response.status}`);
      }

      const files = await response.json();
      this.addLog(`Fetched ${files.length} items from GitHub subfolder: ${path}`);

      for (const file of files) {
        if (file.type === "file") {
          this.addLog(`Fetching GitHub file: ${file.path}`);
          const fileContent = await this.fetchFileContentGitHub(file.download_url);
          zipFolder.file(file.name, fileContent);
          this.addLog(`Added file to ZIP: ${file.name}`);
        } else if (file.type === "dir") {
          this.addLog(`Entering GitHub nested subdirectory: ${file.path}`);
          await this.addFolderToZipGitHub(zipFolder.folder(file.name), owner, repo, branch, file.path);
        }
      }
    } catch (error) {
      console.error("Error adding GitHub folder to ZIP:", error);
      this.addLog(`Error: ${error.message}`);
      throw error;
    }
  };

  downloadGitHubFile = async ({ owner, repo, branch, path }) => {
    this.setState({ isFetching: true, error: null, progress: 0, outputMessage: "" });
    this.addLog(`Starting to fetch GitHub file: ${path} from branch '${branch}'`);

    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
      this.addLog(`Fetching GitHub file metadata from API: ${apiUrl}`);
      const response = await fetch(apiUrl, this.getFetchOptionsGitHub());

      if (response.status === 404) {
        throw new Error("GitHub file not found. Please check the URL and try again.");
      }

      if (response.status === 403) {
        const rateLimitReset = response.headers.get("X-RateLimit-Reset");
        const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000) : "later";
        throw new Error(`GitHub API rate limit exceeded. Try again after ${resetDate}.`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub file content. Status: ${response.status}`);
      }

      const fileData = await response.json();
      this.addLog(`Fetched GitHub file metadata: ${fileData.path}`);

      if (fileData.type !== "file") {
        throw new Error("The specified GitHub path is not a file.");
      }

      // Fetch the raw file content
      this.addLog(`Fetching raw GitHub file content from: ${fileData.download_url}`);
      const fileContent = await this.fetchFileContentGitHub(fileData.download_url);
      const blob = new Blob([fileContent], { type: "application/octet-stream" });
      saveAs(blob, fileData.name);
      this.addLog(`GitHub file download initiated: ${fileData.name}`);

      this.setState({
        isFetching: false,
        outputMessage: "GitHub file fetched successfully!",
        progress: 100,
      });
      this.addLog("GitHub file fetching process completed.");
    } catch (error) {
      console.error("Error fetching GitHub file:", error);
      this.addLog(`Error: ${error.message}`);
      this.setState({
        error: error.message,
        isFetching: false,
      });
    }
  };

  fetchFileContentGitHub = async (url) => {
    try {
      this.addLog(`Fetching GitHub file content from URL: ${url}`);
      const response = await fetch(url, this.getFetchOptionsGitHub());
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub file content from ${url}. Status: ${response.status}`);
      }
      this.addLog("GitHub file content fetched successfully.");
      return await response.blob();
    } catch (error) {
      console.error("Error fetching GitHub file content:", error);
      this.addLog(`Error: ${error.message}`);
      throw error;
    }
  };


  downloadGitLabRepository = async ({ fullName }) => {
    this.setState({ isFetching: true, error: null, progress: 0, outputMessage: "" });
    this.addLog(`Starting to fetch GitLab repository: ${fullName}`);

    try {
      this.addLog("Fetching GitLab repository data...");
      const repoData = await this.fetchRepoDataGitLab(fullName);
      const defaultBranch = repoData.default_branch;
      this.addLog(`Default branch is '${defaultBranch}'.`);

      const repoName = fullName.split("/").pop();
      const zipUrl = `https://gitlab.com/${fullName}/-/archive/${encodeURIComponent(defaultBranch)}/${encodeURIComponent(repoName)}-${encodeURIComponent(defaultBranch)}.zip`;
      this.addLog(`Constructed ZIP URL: ${zipUrl}`);

      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `${repoName}-${defaultBranch}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.addLog("Download initiated via browser.");

      this.setState({
        isFetching: false,
        outputMessage: "GitLab repository download initiated.",
      });
      this.addLog("GitLab repository fetching process completed.");
    } catch (error) {
      console.error("Error fetching GitLab repository:", error);
      this.addLog(`Error: ${error.message}`);
      this.setState({
        error: error.message,
        isFetching: false,
      });
    }
  };

  fetchRepoDataGitLab = async (fullName) => {
    const apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(fullName)}`;
    this.addLog(`Fetching GitLab repository data from API: ${apiUrl}`);
    const response = await fetch(apiUrl, this.getFetchOptionsGitLab());

    if (response.status === 404) {
      throw new Error("GitLab repository not found. Please check the URL and try again.");
    }

    if (response.status === 403) {
      const rateLimitReset = response.headers.get("RateLimit-Reset");
      const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000) : "later";
      throw new Error(`GitLab API rate limit exceeded. Try again after ${resetDate}.`);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch GitLab repository data. Status: ${response.status}`);
    }

    this.addLog("GitLab repository data fetched successfully.");
    return await response.json();
  };

  downloadGitLabFolder = async ({ fullName, branch, path }) => {
    this.setState({ isFetching: true, error: null, progress: 0, outputMessage: "" });
    this.addLog(`Starting to fetch GitLab folder: ${path} from branch '${branch}'`);

    try {
      // Fetch all files recursively within the folder
      this.addLog("Fetching GitLab folder contents recursively...");
      const files = await this.fetchAllFilesGitLab(fullName, branch, path);

      if (!files.length) {
        throw new Error("The specified GitLab path does not contain any files.");
      }

      this.addLog(`Fetched ${files.length} files from GitLab folder.`);

      const zip = new JSZip();
      const total = files.length;
      let completed = 0;

      for (const file of files) {
        this.addLog(`Fetching GitLab file: ${file.path}`);
        const fileContent = await this.fetchFileContentGitLab(fullName, branch, file.path);
        const relativePath = file.path.substring(path.length + 1); // Remove the base path
        zip.file(relativePath, fileContent);
        this.addLog(`Added file to ZIP: ${relativePath}`);
        completed += 1;
        this.setState({ progress: Math.round((completed / total) * 100) });
        this.addLog(`Progress: ${this.state.progress}%`);
      }

      this.addLog("Generating ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
      });
      this.addLog("ZIP file generated successfully.");

      saveAs(zipBlob, `${path.split("/").pop() || "folder"}.zip`);
      this.addLog("ZIP file download initiated.");

      this.setState({
        isFetching: false,
        outputMessage: "GitLab folder fetched successfully!",
        progress: 100,
      });
      this.addLog("GitLab folder fetching process completed.");
    } catch (error) {
      console.error("Error fetching and zipping GitLab folder:", error);
      this.addLog(`Error: ${error.message}`);
      this.setState({
        error: error.message,
        isFetching: false,
      });
    }
  };

  fetchAllFilesGitLab = async (fullName, branch, path) => {
    const apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(fullName)}/repository/tree?path=${encodeURIComponent(path)}&ref=${encodeURIComponent(branch)}&recursive=true&per_page=100`;

    this.addLog(`Fetching GitLab files from API: ${apiUrl}`);

    let files = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const pagedUrl = `${apiUrl}&page=${page}`;
      this.addLog(`Fetching page ${page} of GitLab folder contents.`);
      const response = await fetch(pagedUrl, this.getFetchOptionsGitLab());

      if (!response.ok) {
        throw new Error(`Failed to fetch GitLab folder contents. Status: ${response.status}`);
      }

      const data = await response.json();
      const linkHeader = response.headers.get("Link");
      const nextPage = linkHeader && linkHeader.includes('rel="next"');

      const filteredFiles = data.filter((item) => item.type === "blob");
      files = files.concat(filteredFiles);

      if (nextPage) {
        page += 1;
      } else {
        hasNextPage = false;
      }
    }

    this.addLog(`Total GitLab files fetched: ${files.length}`);
    return files;
  };

  downloadGitLabFile = async ({ fullName, branch, path }) => {
    this.setState({ isFetching: true, error: null, progress: 0, outputMessage: "" });
    this.addLog(`Starting to fetch GitLab file: ${path} from branch '${branch}'`);

    try {
      const fileContent = await this.fetchFileContentGitLab(fullName, branch, path);
      const blob = new Blob([fileContent], { type: "application/octet-stream" });
      const fileName = path.split("/").pop();
      saveAs(blob, fileName);
      this.addLog(`GitLab file download initiated: ${fileName}`);

      this.setState({
        isFetching: false,
        outputMessage: "GitLab file fetched successfully!",
        progress: 100,
      });
      this.addLog("GitLab file fetching process completed.");
    } catch (error) {
      console.error("Error downloading GitLab file:", error);
      this.addLog(`Error: ${error.message}`);
      this.setState({
        error: error.message,
        isFetching: false,
      });
    }
  };

  fetchFileContentGitLab = async (fullName, branch, path) => {
    try {
      const apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(fullName)}/repository/files/${encodeURIComponent(path)}/raw?ref=${encodeURIComponent(branch)}`;
      this.addLog(`Fetching GitLab file content from API: ${apiUrl}`);
      const response = await fetch(apiUrl, this.getFetchOptionsGitLab());

      if (!response.ok) {
        throw new Error(`Failed to fetch GitLab file content. Status: ${response.status}`);
      }

      this.addLog("GitLab file content fetched successfully.");
      return await response.blob();
    } catch (error) {
      console.error("Error fetching GitLab file content:", error);
      this.addLog(`Error: ${error.message}`);
      throw error;
    }
  };

  getFetchOptionsGitHub = () => {
    const { githubToken } = this.state;
    const headers = {
      Accept: "application/vnd.github.v3+json",
    };

    if (githubToken) {
      headers.Authorization = `token ${githubToken}`;
    }

    return { headers };
  };

  getFetchOptionsGitLab = () => {
    const { gitlabToken } = this.state;
    const headers = {};

    if (gitlabToken) {
      headers["PRIVATE-TOKEN"] = gitlabToken;
    }

    return { headers };
  };

  render() {
    const { inputUrl, outputMessage, error, isFetching, progress, logs } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 0.5em;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background-color: #334155;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #4b5563;
              border-radius: 0.5em;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #9ca3af;
            }
          `}
        </style>

        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Git Folder Downloader</h1>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <h2 className="self-end text-lg text-gray-300">Repository URL</h2>
              <div className="flex">
                <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.clearInput} title="Clear Input">
                  <ClearIcon />
                </button>
              </div>
            </div>
            <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
              <input
                className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-gray-700 focus:border-blue-400 focus:bg-gray-700 font-mono rounded-md"
                spellCheck="false"
                value={inputUrl}
                onChange={this.handleInputChange}
                placeholder="Enter GitHub or GitLab URL"
              />
            </div>

            {/*
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-gray-300">GitHub Token (Optional)</label>
                <input
                  type="password"
                  className="h-10 bg-gray-800 px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md"
                  value={githubToken}
                  onChange={(e) => this.setState({ githubToken: e.target.value })}
                  placeholder="Enter your GitHub token"
                />
                <small className="text-gray-500">
                  Providing a GitHub token increases your API rate limit and allows access to private repositories.
                </small>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-300">GitLab Token (Optional)</label>
                <input
                  type="password"
                  className="h-10 bg-gray-800 px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md"
                  value={gitlabToken}
                  onChange={(e) => this.setState({ gitlabToken: e.target.value })}
                  placeholder="Enter your GitLab token"
                />
                <small className="text-gray-500">
                  Providing a GitLab token increases your API rate limit and allows access to private repositories.
                </small>
              </div>
            </div>
            */}

            <div className="flex flex-col gap-2 mt-1.5">
              {error && <p className="text-red-500 mb-1">{error}</p>}
              {outputMessage && <p className="text-green-500 mb-1">{outputMessage}</p>}
              {isFetching && (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span className="text-white">Processing... {progress}%</span>
                </div>
              )}
              {!isFetching && (
                <button className="w-36 mt-0.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={this.download}>
                  Download
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col h-full mt-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Log</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveOutputAsText} title="Save Logs as Text">
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.copyToClipboard} title="Copy Logs to Clipboard">
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className={`h-[34em] border-2 rounded-lg ${error ? "border-red-600" : "border-gray-600"} bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar`}
                style={{
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
                placeholder="Logs will appear here..."
                value={error ? `Error: ${error}` : logs.join("\n")}
                readOnly
              />
            </div>
          </div>
        </section>
      </main>
    );
  }

  addFolderToZipGitHub = async (zipFolder, owner, repo, branch, path) => {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
      this.addLog(`Fetching GitHub subfolder contents from API: ${apiUrl}`);
      const response = await fetch(apiUrl, this.getFetchOptionsGitHub());

      if (response.status === 404) {
        throw new Error(`GitHub folder not found: ${path}`);
      }

      if (response.status === 403) {
        const rateLimitReset = response.headers.get("X-RateLimit-Reset");
        const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000) : "later";
        throw new Error(`GitHub API rate limit exceeded. Try again after ${resetDate}.`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub folder contents: ${path}. Status: ${response.status}`);
      }

      const files = await response.json();
      this.addLog(`Fetched ${files.length} items from GitHub subfolder: ${path}`);

      for (const file of files) {
        if (file.type === "file") {
          this.addLog(`Fetching GitHub file: ${file.path}`);
          const fileContent = await this.fetchFileContentGitHub(file.download_url);
          zipFolder.file(file.name, fileContent);
          this.addLog(`Added file to ZIP: ${file.name}`);
        } else if (file.type === "dir") {
          this.addLog(`Entering GitHub nested subdirectory: ${file.path}`);
          await this.addFolderToZipGitHub(zipFolder.folder(file.name), owner, repo, branch, file.path);
        }
      }
    } catch (error) {
      console.error("Error adding GitHub folder to ZIP:", error);
      this.addLog(`Error: ${error.message}`);
      throw error;
    }
  };
}

export default GitFolderDownloader;
