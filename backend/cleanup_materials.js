import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Material from './src/models/Materials.js';

dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.mongo_url);
        console.log("Connected to MongoDB...");

        const materials = await Material.find();
        console.log(`Found ${materials.length} total material records.`);

        // Group materials by artisan, name (lowercase), and unit (lowercase)
        const groups = {};

        materials.forEach(m => {
            const artisanId = m.artisan?.toString() || 'unknown';
            const key = `${artisanId}_${m.name.toLowerCase().trim()}_${m.unit.toLowerCase().trim()}`;
            
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(m);
        });

        let totalDeleted = 0;

        for (const key in groups) {
            const group = groups[key];
            if (group.length > 1) {
                console.log(`Merging ${group.length} records for: ${group[0].name} (${group[0].unit})`);
                
                // Keep the first one, sum others into it
                const main = group[0];
                let extraQty = 0;
                let extraCost = 0;

                for (let i = 1; i < group.length; i++) {
                    extraQty += group[i].quantity;
                    extraCost += group[i].cost;
                    
                    // Delete the duplicate
                    await Material.findByIdAndDelete(group[i]._id);
                    totalDeleted++;
                }

                main.quantity += extraQty;
                main.cost += extraCost;
                await main.save();
            }
        }

        console.log(`Cleanup complete! Merged duplicates into single records. Total duplicates removed: ${totalDeleted}`);
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};

cleanup();
