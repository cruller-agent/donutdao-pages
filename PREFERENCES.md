# Development Preferences

## Smart Contract Development

**Use Foundry, not Hardhat**

- **Framework:** Foundry (forge, cast, anvil)
- **Testing:** Solidity tests (not JavaScript)
- **Deployment:** Forge scripts (not Hardhat tasks)
- **Why:** Faster, native Solidity, better developer experience

When starting smart contract projects:
```bash
forge init project-name
cd project-name
# Use forge test, forge script, forge create
```

## Other Preferences

- **Package Manager:** npm (already default)
- **Git:** Commit regularly, clear messages
- **Documentation:** README + inline comments
