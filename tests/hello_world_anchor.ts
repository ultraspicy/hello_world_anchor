import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorldAnchor } from "../target/types/hello_world_anchor";
const { SystemProgram } = anchor.web3;
const assert = require("assert");

describe("hello_world_anchor", () => {
  // arrange
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.HelloWorldAnchor as Program<HelloWorldAnchor>;
  const myAccount = anchor.web3.Keypair.generate();

  // actions & assert 
  it("Is initialized!", async () => {
    const tx = await program.methods
    .initialize(new anchor.BN(1234))
    .accounts({
      myAccount: myAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([myAccount])
    .rpc();
    console.log("Your transaction signature", tx);

    // Fetch the newly created account from the cluster.
    const account = await program.account.myAccount.fetch(myAccount.publicKey);

    // Check it's state was initialized.
    assert.ok(account.data.eq(new anchor.BN(1234)));
  });

  it("Is updated!", async () => {
    const tx = await program.methods
    .update(new anchor.BN(9999))
    .accounts({
      myAccount: myAccount.publicKey
    })
    .rpc();

    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    assert.ok(account.data.eq(new anchor.BN(9999)));
  });
});
