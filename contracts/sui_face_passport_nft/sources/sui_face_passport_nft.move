module sui_face_passport_nft::sui_face_passport_nft {
    // Add this import for upgrades
    use sui::package;
    use sui::display;
    use sui::random::{Self, Random, new_generator};
    use sui::url::{Self, Url};
    use sui::event;
    use std::string;
    use sui::table::{Self,Table, new};
    use sui::clock::{Self, Clock};

    // Error constants
    const EAlreadyMinted: u64 = 1;
    const EUnauthorizedBurn: u64 = 2;

    // Add this struct for upgrade capability
    public struct SUI_FACE_PASSPORT_NFT has drop {}
    
    // -------------------------------
    // NFT STRUCT
    // -------------------------------
    public struct SuiFacePassportNFT has key {
        id: UID,
        name: string::String,
        description: string::String,
        url: Url,
        uuid: string::String, // Random alphanumeric ID
        owner: address,
        creator: address,
        created_at: u64,
    }

    // -------------------------------
    // Registry to enforce one NFT per wallet + UUID counter
    // -------------------------------
    public struct MintRegistry has key {
        id: UID,
        minted: Table<address, bool>,
        deployer: address,
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
    // INIT: Called automatically on publish - creates upgrade capability AND Display
    // -------------------------------
    fun init(otw: SUI_FACE_PASSPORT_NFT, ctx: &mut TxContext) {
        // Create upgrade capability and transfer to deployer
        let publisher = package::claim(otw, ctx);
        let deployer = tx_context::sender(ctx);
        
        // Create Display object for FacePassportNFT with standard NFT fields
        let keys = vector[
            b"name".to_string(),
            b"description".to_string(), 
            b"image_url".to_string(),  // Standard field name for NFT images
            b"uuid".to_string(),
            b"owner".to_string(),
            b"creator".to_string(),
            b"created_at".to_string(),
            b"project_url".to_string(),
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{description}".to_string(),
            b"{url}".to_string(),  // Maps to the url field
            b"{uuid}".to_string(),
            b"{owner}".to_string(),
            b"{creator}".to_string(),
            b"{created_at}".to_string(),
            b"https://sui-face-dapp.vercel.app/".to_string(), // Static project URL
        ];

        // Create and configure the Display
        let mut display = display::new_with_fields<SuiFacePassportNFT>(
            &publisher, keys, values, ctx
        );
        
        // Commit the Display version
        display.update_version();

        // Transfer objects
        transfer::public_transfer(publisher, deployer);
        transfer::public_transfer(display, deployer);
        
        // Auto-create the registry on first deploy
        let registry = MintRegistry {
            id: object::new(ctx),
            minted: new(ctx),   
            deployer,
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
        assert!(!table::contains(&registry.minted, sender), EAlreadyMinted);

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
        let walrus_url = b"https://aggregator.walrus-testnet.walrus.space/v1/blobs/jQMx0dtpw9wbTz_kM7ayA4Tqz3XHstPfYDKkLnY441g";
        let nft_description = b"A Proof-Of-Humanity Passport SoulboundNFT";
        let uuid = string::utf8(uuid_chars);
        let mut nft_name = string::utf8(b"Sui Face Passport #");
        string::append(&mut nft_name, uuid);
        
        let nft = SuiFacePassportNFT {
            id: object::new(ctx),
            name: nft_name,
            description: string::utf8(nft_description),
            url: url::new_unsafe_from_bytes(walrus_url),
            uuid,
            owner: sender,
            creator: registry.deployer,
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
    // Updated burn function that allows re-minting
    // -------------------------------
    public entry fun burn(
        nft: SuiFacePassportNFT, 
        registry: &mut MintRegistry,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Verify sender owns this NFT
        assert!(nft.owner == sender, EUnauthorizedBurn);
        
        // Extract UUID before destroying NFT
        let uuid = nft.uuid;
        
        // Remove from registry to allow re-minting
        table::remove(&mut registry.minted, sender);
        
        // Destroy the NFT
        let SuiFacePassportNFT { id, name: _, description: _, url: _, uuid: _, owner: _, creator: _, created_at: _ } = nft;
        object::delete(id);
        
        // Emit burn event
        event::emit(NFTBurned {
            creator: sender,
            uuid,
        });
    }

    // -------------------------------
    // View helpers
    // -------------------------------
    public fun name(nft: &SuiFacePassportNFT): &string::String {
        &nft.name
    }

    public fun description(nft: &SuiFacePassportNFT): &string::String {
        &nft.description
    }

    public fun url(nft: &SuiFacePassportNFT): &Url {
        &nft.url
    }

    public fun uuid(nft: &SuiFacePassportNFT): &string::String {
        &nft.uuid
    }

    public fun owner(nft: &SuiFacePassportNFT): &address {
        &nft.owner
    }
    
    public fun creator(nft: &SuiFacePassportNFT): &address {
        &nft.creator
    }
    
    public fun created_at(nft: &SuiFacePassportNFT): &u64 {
        &nft.created_at
    }

    // -------------------------------
    // ⚠️ DO NOT expose transfer() — keeps NFT soulbound
    // -------------------------------
}