# AGPL Compliance Notice

GXEON Media Center is based on an Odysseus fork. Upstream attribution, copyright notices, and license notices must be preserved in source distributions, container images, hosted deployments, documentation, and release notes where applicable.

Some dependencies or optional components may be covered by the GNU Affero General Public License (AGPL). When modified AGPL-covered code is served over a network, operators may be required to offer the corresponding source code to users who interact with that network service.

This notice is an engineering compliance checklist and project policy aid; it is not legal advice.

## Release checklist

- [ ] Preserve upstream Odysseus attribution and license notices.
- [ ] Identify AGPL-covered files, dependencies, and optional extras included in the release.
- [ ] Document local modifications to AGPL-covered code.
- [ ] Provide corresponding source code for network-served AGPL-covered modifications when required.
- [ ] Include build instructions, Dockerfile changes, dependency manifests, and patch history needed to recreate the served version.
- [ ] Confirm no secrets, tokens, private data, generated credentials, or environment files are included.
- [ ] Keep a copy of the exact source revision deployed to production.
