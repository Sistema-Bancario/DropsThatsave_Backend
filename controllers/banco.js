const Banco = require('../models/banco');
const mongoose = require('mongoose');

const mostrarBancos = async (req, res) => {
    try {
      const bancos = await Banco.find();
  
      res.json({
        bancos
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: 'Error al mostrar los bancos'
      });
    }
  };
  



const postBanco = async (req, res) => {
    try {
        const { nombre, direccion, telefono, estado, apertura, cierre, img } = req.body;
        
        const nuevoBanco = new Banco({
            nombre,
            direccion,
            telefono,
            estado,
            apertura, 
            cierre,
            img
        });
        
        const bancoGuardado = await nuevoBanco.save();
        
        res.json({
            msg: 'Banco creado exitosamente',
            banco: bancoGuardado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al crear el banco'
        });
    }
}

const putBanco = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, estado, img } = req.body;

        // Verificar si el ID del banco es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'ID de banco inválido'
            });
        }

        // Buscar el banco por su ID y actualizar los campos proporcionados
        const bancoEditado = await Banco.findByIdAndUpdate(id, {
            nombre,
            direccion,
            estado,
            img
        }, { new: true });

        // Verificar si el banco existe
        if (!bancoEditado) {
            return res.status(404).json({
                msg: 'Banco no encontrado'
            });
        }

        res.json({
            msg: 'Banco editado exitosamente',
            banco: bancoEditado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al editar el banco'
        });
    }
};

const deleteBanco = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'ID de banco inválido'
            });
        }

        const bancoEliminado = await Banco.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!bancoEliminado) {
            return res.status(404).json({
                msg: 'Banco no encontrado'
            });
        }

        res.json({
            msg: 'Banco eliminado exitosamente',
            banco: bancoEliminado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al eliminar el banco'
        });
    }
};



module.exports = {
    postBanco,
    putBanco,
    deleteBanco,
    mostrarBancos
}
