module sui_face_passport_nft::sui_face_passport_nft {
    // Add this import for upgrades
    use sui::package;
    // use sui::object::{Self, UID};
    // use sui::tx_context::{Self, TxContext};
    // use sui::transfer;
    use sui::random::{Self, Random, new_generator};
    use sui::url::{Self, Url};
    use sui::event;
    use std::string;
    use sui::table::{Self,Table, new};
    use sui::clock::{Self, Clock};


    // Add this struct for upgrade capability
    public struct SUI_FACE_PASSPORT_NFT has drop {}
    // -------------------------------
    // NFT STRUCT
    // -------------------------------
    public struct FacePassportNFT has key {
        id: UID,
        name: string::String,
        description: string::String,
        url: Url,
        uuid: string::String, // Random alphanumeric ID
        owner: address,
        created_at: u64,
    }

    // -------------------------------
    // Registry to enforce one NFT per wallet + UUID counter
    // -------------------------------
    public struct MintRegistry has key {
        id: UID,
        minted: Table<address, bool>,
    }

    // -------------------------------
    // Event: useful for frontend
    // -------------------------------
    public struct NFTMinted has copy, drop {
        object_id: address,
        creator: address,
        uuid: string::String,
    }

    public struct NFTBurned has copy, drop {
        creator: address,
        uuid: string::String,
    }

    // -------------------------------
    // INIT: Called automatically on publish - creates upgrade capability
    // -------------------------------
    fun init(otw: SUI_FACE_PASSPORT_NFT, ctx: &mut TxContext) {
        // Create upgrade capability and transfer to deployer
        package::claim_and_keep(otw, ctx);
        
        // Auto-create the registry on first deploy
        let registry = MintRegistry {
            id: object::new(ctx),
            minted: new(ctx),   
        };
        transfer::share_object(registry);
    }

    // -------------------------------
    // Mint NFT using current randomness API
    // -------------------------------
    entry fun mint_proof_nft(
        registry: &mut MintRegistry,
        r: &Random,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // Reject if already minted
        if (table::contains(&registry.minted, sender)) {
            abort 0x1337 // already minted
        };

        // Mark as minted
        table::add(&mut registry.minted, sender, true);

        // Generate random UUID using new API
        let mut generator = new_generator(r, ctx);
        let charset = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let mut uuid_chars = vector::empty<u8>();
        let mut i = 0;
        while (i < 6) {
            let random_index = random::generate_u8_in_range(&mut generator, 0, 35);
            let ch = *vector::borrow(&charset, (random_index as u64));
            vector::push_back(&mut uuid_chars, ch);
            i = i + 1;
        };
        // Hardcoded values for all Face Passport NFTs
        let walrus_url = b"https://aggregator.walrus-testnet.walrus.space/v1/jQMx0dtpw9wbTz_kM7ayA4Tqz3XHstPfYDKkLnY441g";
        let nft_name = b"Sui Face Passport";
        let nft_description = b"A Proof-Of-Humanity Passport SoulboundNFT";
        let uuid = string::utf8(uuid_chars);

        let nft = FacePassportNFT {
            id: object::new(ctx),
            name: string::utf8(nft_name),
            description: string::utf8(nft_description),
            url: url::new_unsafe_from_bytes(walrus_url),
            uuid,
            owner: sender,
            created_at: clock::timestamp_ms(clock),
        };

        event::emit(NFTMinted {
            object_id: object::uid_to_address(&nft.id),
            creator: sender,
            uuid,
        });

        transfer::transfer(nft, sender);
    }

    // -------------------------------
    // View helpers
    // -------------------------------
    public fun name(nft: &FacePassportNFT): &string::String {
        &nft.name
    }

    public fun description(nft: &FacePassportNFT): &string::String {
        &nft.description
    }

    public fun url(nft: &FacePassportNFT): &Url {
        &nft.url
    }

    public fun uuid(nft: &FacePassportNFT): &string::String {
        &nft.uuid
    }

    public fun owner(nft: &FacePassportNFT): &address {
        &nft.owner
    }

    public fun created_at(nft: &FacePassportNFT): &u64 {
        &nft.created_at
    }
    // -------------------------------
    // Optional: burn function
    // -------------------------------
    // public entry fun burn(nft: FacePassportNFT, _: &mut TxContext) {
    //     let FacePassportNFT { id, name: _, description: _, url: _, uuid: _, owner: _, created_at: _ } = nft;
    //     id.delete()
    // }
    
    // Updated burn function that allows re-minting
    public entry fun burn(
        nft: FacePassportNFT, 
        registry: &mut MintRegistry,
        ctx: &mut TxContext
    ) {
    let sender = tx_context::sender(ctx);
    
    // Verify sender owns this NFT
    assert!(nft.owner == sender, 0x1338); // unauthorized burn
    // Extract UUID before destroying NFT
    let uuid = nft.uuid;
    // Remove from registry to allow re-minting
    table::remove(&mut registry.minted, sender);
    
    // Destroy the NFT
    let FacePassportNFT { id, name: _, description: _, url: _, uuid: _, owner: _, created_at: _ } = nft;
    id.delete();
    
    // Optional: Emit burn event
    event::emit(NFTBurned {
        creator: sender,
        uuid,
    });
}
    // -------------------------------
    // ⚠️ DO NOT expose transfer() — keeps NFT soulbound
    // -------------------------------
}