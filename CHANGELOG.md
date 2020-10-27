
### Release v1.0.3

### Devop

- Use address provided in footer [#879](https://github.com/EthVM/EthVM/pull/879)

### Bug

- Deep watch on chart data sets [#885](https://github.com/EthVM/EthVM/pull/885)
- Fixed transform hash component for easy string copy [#899](https://github.com/EthVM/EthVM/pull/899/commits/e63c11860e9b0a22d7cfecad80719c8787e2c42c)
- Fix mobile loading state padding for address header page [#891](https://github.com/EthVM/EthVM/pull/891)
- Change 24 price change to 24 price change percentage [#887](https://github.com/EthVM/EthVM/pull/887)
- Sentry fix #1950193750 and set contract correctly in CoinData [#895](https://github.com/EthVM/EthVM/pull/895)
- Catch v-img errors on load [#881](https://github.com/EthVM/EthVM/pull/881) 

===================================================================================

### Release v1.0.2

### Bug

- Fix state diff types [#873](https://github.com/EthVM/EthVM/pull/873)
- Fix chart font bug [#869](https://github.com/EthVM/EthVM/pull/869)

### Devop

- Fix public path [#878](https://github.com/EthVM/EthVM/pull/878)
- Update ethvm builds action [#877](https://github.com/EthVM/EthVM/pull/877)
- Add version to footer [#872](https://github.com/EthVM/EthVM/pull/872)
- Add sentry environment [#871](https://github.com/EthVM/EthVM/pull/871)
- Convert all address instance to checksum [#870](https://github.com/EthVM/EthVM/pull/870)
- Fixed spelling mistakes in readme [#866](https://github.com/EthVM/EthVM/pull/866)
- Removedd hardocded strings from UI token details page [#875](https://github.com/EthVM/EthVM/pull/875)
- replaced router-link-tag with a-tag [#880](https://github.com/EthVM/EthVM/pull/880)

===================================================================================

### Release v1.0.1

### Feature

- Detect if address is contract [#857](https://github.com/EthVM/EthVM/pull/857)

### Bug

- Catch correct error [#860](https://github.com/EthVM/EthVM/pull/860)
- Detect if address is contract [#957](https://github.com/EthVM/EthVM/pull/957)
- Add pending tx table [#833](https://github.com/EthVM/EthVM/pull/833)
- Fix BLOCKS pagination is not taking block 0 into account [#850](https://github.com/EthVM/EthVM/pull/850)
- Only hide filter on initialLoad [#848](https://github.com/EthVM/EthVM/pull/848)
- Fix Search All by address by adding isValidAddress check [#847](https://github.com/EthVM/EthVM/pull/847)
- Fix block transaction if route param of the block details is hash [#851](https://github.com/EthVM/EthVM/pull/851)
- Fix block parent route changed to hash [#851](https://github.com/EthVM/EthVM/pull/851)
- Fix for item padding within details list [#853](https://github.com/EthVM/EthVM/pull/853)
- Fix animation for sum menu item change on address page [#854](https://github.com/EthVM/EthVM/pull/854)
- Fix strings [#852](https://github.com/EthVM/EthVM/pull/852)
- Fixes of incorrect rendering of the menu items when user slides between tab items and on switch between mobile/desktop layouts [#855](https://github.com/EthVM/EthVM/pull/855)
- Block Number set to update only when the block number is higher [#835](https://github.com/EthVM/EthVM/pull/835)

### Devop

- New dark layout for mobile tabs
- Added skip query for Contract Meta
- Added error state to emitError on Balance
- Additional animation fix
- Updated NFT image api route
- Added coursor to mobile tab menu, hover color change
- Added divider to app details list for tokens and block
